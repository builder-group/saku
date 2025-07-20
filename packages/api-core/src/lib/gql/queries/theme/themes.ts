import { Err, notEmpty, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/themes
const THEMES = gql(`
	query themes($first: Int = 10, $roles: [ThemeRole!]) {
		themes(first: $first, roles: $roles) {
			edges {
				node {
					id
					name
					role
				}
			}
		}
	}
`);

export async function getThemes(
	input: TGetThemesInput,
	config: TGetThemesConfig
): Promise<TResult<TGetThemesSuccess, AppError>> {
	const { shopId, accessToken } = config;
	const { first = 10, roles } = input;

	const result = await shopifyAdminApiClient.query(THEMES, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			first,
			roles
		},
		headers: {
			'X-Shopify-Access-Token': accessToken
		}
	});
	if (result.isErr()) {
		return Err(
			new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
				detail: `Shopify API request failed: ${result.error.message}`
			})
		);
	}

	const themes = result.value.data.themes;
	return Ok({
		themes:
			themes?.edges
				.map((edge) => {
					if (edge?.node?.id == null || edge?.node?.name == null) {
						return null;
					}

					return {
						id: edge.node.id,
						name: edge.node.name,
						role: edge.node.role
					};
				})
				.filter(notEmpty) ?? []
	});
}

interface TGetThemesConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetThemesInput {
	first?: number;
	roles?: ('MAIN' | 'UNPUBLISHED' | 'DEMO' | 'DEVELOPMENT' | 'ARCHIVED' | 'LOCKED' | 'MOBILE')[];
}

export interface TGetThemesSuccess {
	themes: {
		id: string;
		name: string;
		role: 'MAIN' | 'UNPUBLISHED' | 'DEMO' | 'DEVELOPMENT' | 'ARCHIVED' | 'LOCKED' | 'MOBILE';
	}[];
}
