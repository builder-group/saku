import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig, VariablesOf } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/mutations/urlRedirectCreate
export const URL_REDIRECT_CREATE = gql(`
	mutation urlRedirectCreate($urlRedirect: UrlRedirectInput!) {
		urlRedirectCreate(urlRedirect: $urlRedirect) {
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

export async function createUrlRedirect(
	input: TUrlRedirectInput,
	config: TCreateUrlRedirectConfig
): Promise<TResult<TUrlRedirectCreateSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(URL_REDIRECT_CREATE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: { urlRedirect: input },
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

	const urlRedirectCreate = result.value.data?.urlRedirectCreate;
	if (urlRedirectCreate?.urlRedirect == null) {
		return Err(
			new AppError('#ERR_NO_REDIRECT_CREATED', 500, {
				detail: 'No URL redirect was created in Shopify'
			})
		);
	}

	const { urlRedirect, userErrors } = urlRedirectCreate;
	if (userErrors?.length) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((e) => e.message).join(', ')
			})
		);
	}

	return Ok({
		id: urlRedirect.id,
		path: urlRedirect.path as `/${string}`,
		target: urlRedirect.target as `/${string}`
	});
}

interface TCreateUrlRedirectConfig {
	shopId: string;
	accessToken: string;
}

export type TUrlRedirectInput = VariablesOf<typeof URL_REDIRECT_CREATE>['urlRedirect'];

export type TUrlRedirectCreateSuccess = {
	id: string;
	path: `/${string}`;
	target: `/${string}`;
};
