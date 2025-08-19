import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/mutations/storefrontAccessTokenDelete
const STOREFRONT_ACCESS_TOKEN_DELETE = gql(`
	mutation storefrontAccessTokenDelete($input: StorefrontAccessTokenDeleteInput!) {
		storefrontAccessTokenDelete(input: $input) {
			deletedStorefrontAccessTokenId
			userErrors {
				field
				message
			}
		}
	}
`);

export async function deleteStorefrontAccessToken(
	input: TStorefrontAccessTokenDeleteInput,
	config: TDeleteStorefrontAccessTokenConfig
): Promise<TResult<TStorefrontAccessTokenDeleteSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(STOREFRONT_ACCESS_TOKEN_DELETE, {
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

	const storefrontAccessTokenDelete = result.value.data?.storefrontAccessTokenDelete;
	if (storefrontAccessTokenDelete == null) {
		return Err(
			new AppError('#ERR_NO_TOKEN_DELETED', 500, {
				detail: 'No storefront access token was deleted in Shopify'
			})
		);
	}

	const { deletedStorefrontAccessTokenId, userErrors } = storefrontAccessTokenDelete;
	if (userErrors?.length > 0) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((e) => e.message).join(', '),
				errors: userErrors
			})
		);
	}
	if (deletedStorefrontAccessTokenId == null) {
		return Err(
			new AppError('#ERR_NO_TOKEN_DELETED', 500, {
				detail: 'No storefront access token was deleted in Shopify'
			})
		);
	}

	return Ok({
		id: deletedStorefrontAccessTokenId
	});
}

interface TDeleteStorefrontAccessTokenConfig {
	shopId: string;
	accessToken: string;
}

export interface TStorefrontAccessTokenDeleteInput {
	id: string;
}

export interface TStorefrontAccessTokenDeleteSuccess {
	id: string;
}
