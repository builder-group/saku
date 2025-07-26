import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig, VariablesOf } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/mutations/storefrontAccessTokenCreate
const STOREFRONT_ACCESS_TOKEN_CREATE = gql(`
	mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
		storefrontAccessTokenCreate(input: $input) {
			storefrontAccessToken {
				id
				accessToken
				title
				accessScopes {
					handle
				}
				createdAt
			}
			userErrors {
				field
				message
			}
		}
	}
`);

export async function createStorefrontAccessToken(
	input: TStorefrontAccessTokenCreateInput,
	config: TCreateStorefrontAccessTokenConfig
): Promise<TResult<TStorefrontAccessTokenCreateSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(STOREFRONT_ACCESS_TOKEN_CREATE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: { input },
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

	const storefrontAccessTokenCreate = result.value.data?.storefrontAccessTokenCreate;
	if (storefrontAccessTokenCreate == null) {
		return Err(
			new AppError('#ERR_NO_TOKEN_CREATED', 500, {
				detail: 'No storefront access token was created in Shopify'
			})
		);
	}

	const { storefrontAccessToken, userErrors } = storefrontAccessTokenCreate;
	if (userErrors?.length > 0) {
		if (userErrors.some((e) => e.message.includes('limit'))) {
			return Err(
				new AppError('#ERR_TOKEN_LIMIT_EXCEEDED', 429, {
					title: 'Token limit exceeded',
					detail: `Maximum of 100 active storefront access tokens per shop has been reached. Please delete an existing token before creating a new one. Shopify error: ${userErrors.map((e) => e.message).join(', ')}`
				})
			);
		}
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((e) => e.message).join(', '),
				errors: userErrors
			})
		);
	}
	if (storefrontAccessToken == null) {
		return Err(
			new AppError('#ERR_NO_TOKEN_CREATED', 500, {
				detail: 'No storefront access token was created in Shopify'
			})
		);
	}

	return Ok({
		id: storefrontAccessToken.id,
		accessToken: storefrontAccessToken.accessToken,
		title: storefrontAccessToken.title,
		accessScopes: storefrontAccessToken.accessScopes.map((scope) => scope.handle),
		createdAt: storefrontAccessToken.createdAt
	});
}

interface TCreateStorefrontAccessTokenConfig {
	shopId: string;
	accessToken: string;
}

export type TStorefrontAccessTokenCreateInput = VariablesOf<
	typeof STOREFRONT_ACCESS_TOKEN_CREATE
>['input'];

export interface TStorefrontAccessTokenCreateSuccess {
	id: string;
	accessToken: string;
	title: string;
	accessScopes: string[];
	createdAt: string;
}
