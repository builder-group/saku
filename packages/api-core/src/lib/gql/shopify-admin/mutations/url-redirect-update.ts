import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/mutations/urlRedirectUpdate
const URL_REDIRECT_UPDATE = gql(`
	mutation urlRedirectUpdate($id: ID!, $urlRedirect: UrlRedirectInput!) {
		urlRedirectUpdate(id: $id, urlRedirect: $urlRedirect) {
			urlRedirect {
				id
				path
				target
			}
			userErrors {
				field
				message
			}
		}
	}
`);

export async function updateUrlRedirect(
	input: TUrlRedirectUpdateInput,
	config: TUpdateUrlRedirectConfig
): Promise<TResult<TUrlRedirectUpdateSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(URL_REDIRECT_UPDATE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			id: input.id,
			urlRedirect: {
				path: input.path,
				target: input.target
			}
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

	const urlRedirectUpdate = result.value.data?.urlRedirectUpdate;
	if (urlRedirectUpdate == null) {
		return Err(
			new AppError('#ERR_NO_REDIRECT_UPDATED', 500, {
				detail: 'No URL redirect was updated in Shopify'
			})
		);
	}

	const { urlRedirect, userErrors } = urlRedirectUpdate;
	if (userErrors?.length) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((e) => e.message).join(', '),
				errors: userErrors
			})
		);
	}
	if (urlRedirect == null) {
		return Err(
			new AppError('#ERR_NO_REDIRECT_UPDATED', 500, {
				detail: 'No URL redirect was updated in Shopify'
			})
		);
	}

	return Ok({
		id: urlRedirect.id,
		path: urlRedirect.path as `/${string}`,
		target: urlRedirect.target as `/${string}`
	});
}

interface TUpdateUrlRedirectConfig {
	shopId: string;
	accessToken: string;
}

export interface TUrlRedirectUpdateInput {
	id: string;
	path: `/${string}`;
	target: `/${string}`;
}

export interface TUrlRedirectUpdateSuccess {
	id: string;
	path: `/${string}`;
	target: `/${string}`;
}
