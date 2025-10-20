import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/shop
export const STOREFRONT_ACCESS_TOKENS = gql(`
	query storefrontAccessTokens($first: Int!, $after: String) {
		shop {
			storefrontAccessTokens(first: $first, after: $after) {
				nodes {
					id
					accessToken
					title
					accessScopes {
						handle
					}
					createdAt
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	}
`);

export async function getStorefrontAccessTokens(
	input: TGetStorefrontAccessTokensInput,
	config: TGetStorefrontAccessTokensConfig
): Promise<TResult<TGetStorefrontAccessTokensSuccess, AppError>> {
	const { shopId, accessToken } = config;
	const { first = 20, after } = input;

	const result = await shopifyAdminApiClient.query(STOREFRONT_ACCESS_TOKENS, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: { first, after },
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

	const shop = result.value.data.shop;
	if (shop == null) {
		return Err(
			new AppError('#ERR_SHOP_NOT_FOUND', 404, {
				detail: 'Shop not found'
			})
		);
	}

	const storefrontAccessTokens = shop.storefrontAccessTokens;
	return Ok({
		tokens: storefrontAccessTokens.nodes.map((token) => ({
			id: token.id,
			accessToken: token.accessToken,
			title: token.title,
			accessScopes: token.accessScopes.map((scope) => scope.handle),
			createdAt: token.createdAt
		})),
		pageInfo: {
			hasNextPage: storefrontAccessTokens.pageInfo.hasNextPage,
			endCursor: storefrontAccessTokens.pageInfo.endCursor ?? undefined
		}
	});
}

interface TGetStorefrontAccessTokensConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetStorefrontAccessTokensInput {
	first?: number;
	after?: string;
}

export interface TGetStorefrontAccessTokensSuccess {
	tokens: {
		id: string;
		accessToken: string;
		title: string;
		accessScopes: string[];
		createdAt: string;
	}[];
	pageInfo: {
		hasNextPage: boolean;
		endCursor?: string;
	};
}
