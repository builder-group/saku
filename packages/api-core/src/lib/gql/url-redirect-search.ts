import { Err, notEmpty, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/urlRedirects
export const URL_REDIRECTS_SEARCH = gql(`
	query urlRedirectsSearch(
		$first: Int!,
		$after: String,
		$query: String,
		$sortKey: UrlRedirectSortKeys,
		$reverse: Boolean
	) {
		urlRedirects(
			first: $first,
			after: $after,
			query: $query,
			sortKey: $sortKey,
			reverse: $reverse
		) {
			edges {
				node {
					id
					path
					target
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
`);

export async function searchUrlRedirects(
	input: TUrlRedirectsSearchInput,
	config: TSearchUrlRedirectsConfig
): Promise<TResult<TUrlRedirectsSearchSuccess, AppError>> {
	const { shopId, accessToken } = config;
	const { first = 20, after, query, sortKey = 'PATH', reverse = false } = input;

	// Convert structured query to string if needed
	const queryString =
		typeof query === 'object' && query != null
			? [query.path && `path:${query.path}`, query.target && `target:${query.target}`]
					.filter(Boolean)
					.join(' AND ')
			: query;

	const result = await shopifyAdminApiClient.query(URL_REDIRECTS_SEARCH, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			first,
			after,
			query: queryString,
			sortKey,
			reverse
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

	const urlRedirects = result.value.data.urlRedirects;
	return Ok({
		urlRedirects: urlRedirects.edges
			.map((edge) => {
				if (edge?.node?.id == null || edge?.node?.path == null || edge?.node?.target == null) {
					return null;
				}

				return {
					id: edge.node.id,
					path: edge.node.path as `/${string}`,
					target: edge.node.target as `/${string}`
				};
			})
			.filter(notEmpty),
		pageInfo: {
			hasNextPage: urlRedirects.pageInfo.hasNextPage,
			endCursor: urlRedirects.pageInfo.endCursor ?? undefined
		}
	});
}

interface TSearchUrlRedirectsConfig {
	shopId: string;
	accessToken: string;
}

export interface TUrlRedirectsSearchStructuredQuery {
	path?: `/${string}`;
	target?: `/${string}`;
}

export interface TUrlRedirectsSearchInput {
	first?: number;
	after?: string;
	query?: string | TUrlRedirectsSearchStructuredQuery;
	sortKey?: 'ID' | 'PATH' | 'RELEVANCE';
	reverse?: boolean;
}

export interface TUrlRedirectsSearchSuccess {
	urlRedirects: {
		id: string;
		path: `/${string}`;
		target: `/${string}`;
	}[];
	pageInfo: {
		hasNextPage: boolean;
		endCursor?: string;
	};
}
