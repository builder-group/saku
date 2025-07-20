import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/mutations/urlRedirectDelete
const URL_REDIRECT_DELETE = gql(`
	mutation urlRedirectDelete($id: ID!) {
		urlRedirectDelete(id: $id) {
			deletedUrlRedirectId
			userErrors {
				field
				message
			}
		}
	}
`);

export async function deleteUrlRedirect(
	input: TUrlRedirectDeleteInput,
	config: TDeleteUrlRedirectConfig
): Promise<TResult<TUrlRedirectDeleteSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(URL_REDIRECT_DELETE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: { id: input.id },
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

	const urlRedirectDelete = result.value.data?.urlRedirectDelete;
	if (urlRedirectDelete == null) {
		return Err(
			new AppError('#ERR_NO_REDIRECT_DELETED', 500, {
				detail: 'No URL redirect was deleted in Shopify'
			})
		);
	}

	const { deletedUrlRedirectId, userErrors } = urlRedirectDelete;
	if (userErrors?.length) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((e) => e.message).join(', '),
				errors: userErrors
			})
		);
	}
	if (deletedUrlRedirectId == null) {
		return Err(
			new AppError('#ERR_NO_REDIRECT_DELETED', 500, {
				detail: 'No URL redirect was deleted in Shopify'
			})
		);
	}

	return Ok({
		id: deletedUrlRedirectId
	});
}

interface TDeleteUrlRedirectConfig {
	shopId: string;
	accessToken: string;
}

export interface TUrlRedirectDeleteInput {
	id: string;
}

export interface TUrlRedirectDeleteSuccess {
	id: string;
}
