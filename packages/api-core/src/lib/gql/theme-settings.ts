import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/theme
export const THEME_SETTINGS = gql(`
	query themeSettings($id: ID!) {
		theme(id: $id) {
			id
			name
			role
			files(filenames: ["config/settings_data.json", "config/settings_schema.json"]) {
				edges {
					node {
						filename
						body {
							... on OnlineStoreThemeFileBodyText {
								content
							}
						}
					}
				}
			}
		}
	}
`);

export async function getThemeSettings(
	input: TGetThemeSettingsInput,
	config: TGetThemeSettingsConfig
): Promise<TResult<TGetThemeSettingsSuccess, AppError>> {
	const { shopId, accessToken } = config;
	const { id } = input;

	const result = await shopifyAdminApiClient.query(THEME_SETTINGS, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: { id },
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

	const theme = result.value.data.theme;
	if (theme == null) {
		return Err(
			new AppError('#ERR_THEME_NOT_FOUND', 404, {
				detail: 'Theme not found'
			})
		);
	}

	const files: TGetThemeSettingsSuccess['files'] = {};
	theme.files?.edges.forEach((edge) => {
		if (edge.node.body.__typename !== 'OnlineStoreThemeFileBodyText') {
			return;
		}

		switch (edge.node.filename) {
			case 'config/settings_data.json':
				files['settings_data.json'] = edge.node.body.content;
				break;
			case 'config/settings_schema.json':
				files['settings_schema.json'] = edge.node.body.content;
				break;
		}
	});

	return Ok({
		theme: {
			id: theme.id,
			name: theme.name,
			role: theme.role
		},
		files
	});
}

interface TGetThemeSettingsConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetThemeSettingsInput {
	id: string;
}

export interface TGetThemeSettingsSuccess {
	theme: {
		id: string;
		name: string;
		role: string;
	};
	files: {
		'settings_data.json'?: string;
		'settings_schema.json'?: string;
	};
}
