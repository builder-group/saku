import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/mutations/urlRedirectBulkDeleteBySearch
const URL_REDIRECT_BULK_DELETE_BY_SEARCH = gql(`
	mutation urlRedirectBulkDeleteBySearch($search: String!) {
		urlRedirectBulkDeleteBySearch(search: $search) {
			job {
				done
				id
			}
			userErrors {
				code
				field
				message
			}
		}
	}
`);

export async function bulkDeleteUrlRedirectsBySearch(
	input: TUrlRedirectBulkDeleteBySearchInput,
	config: TBulkDeleteUrlRedirectsBySearchConfig
): Promise<TResult<TUrlRedirectBulkDeleteBySearchSuccess, AppError>> {
	const { shopId, accessToken } = config;
	const { search } = input;

	// Convert structured search to string if needed
	const searchString =
		typeof search === 'object' && search != null
			? [search.path && `path:"${search.path}"`, search.target && `target:"${search.target}"`]
					.filter(Boolean)
					.join(' AND ')
			: search;

	const result = await shopifyAdminApiClient.query(URL_REDIRECT_BULK_DELETE_BY_SEARCH, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: { search: searchString },
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

	const urlRedirectBulkDeleteBySearch = result.value.data?.urlRedirectBulkDeleteBySearch;
	if (urlRedirectBulkDeleteBySearch == null) {
		return Err(
			new AppError('#ERR_NO_BULK_DELETE_RESPONSE', 500, {
				detail: 'No bulk delete response received from Shopify'
			})
		);
	}

	const { job, userErrors } = urlRedirectBulkDeleteBySearch;
	if (userErrors?.length) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((e) => e.message).join(', '),
				errors: userErrors
			})
		);
	}
	if (job == null) {
		return Err(
			new AppError('#ERR_NO_JOB_CREATED', 500, {
				detail: 'No bulk delete job was created'
			})
		);
	}

	return Ok({
		job: {
			id: job.id,
			done: job.done
		}
	});
}

interface TBulkDeleteUrlRedirectsBySearchConfig {
	shopId: string;
	accessToken: string;
}

export interface TUrlRedirectBulkDeleteBySearchStructuredQuery {
	path?: `/${string}`;
	target?: `/${string}`;
}

export interface TUrlRedirectBulkDeleteBySearchInput {
	search: string | TUrlRedirectBulkDeleteBySearchStructuredQuery;
}

export interface TUrlRedirectBulkDeleteBySearchSuccess {
	job: {
		id: string;
		done: boolean;
	};
}
