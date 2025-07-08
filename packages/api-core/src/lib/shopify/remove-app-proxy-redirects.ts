import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { shopifyConfig } from '@/environment';
import { bulkDeleteUrlRedirectsBySearch } from '@/lib/gql/url-redirect-bulk-delete-by-search';
import { searchUrlRedirects } from '@/lib/gql/url-redirect-search';

/**
 * Removes all URL redirects that target the app proxy path.
 *
 * **Why we can't use wildcard search directly:**
 *
 * Shopify's search syntax supports wildcards (`*`) for prefix matching, but this only works
 * on tokenized fields. The `target` field for URL redirects is non-tokenized, meaning:
 * - `target:"/a/saku*"` doesn't work (no wildcard support)
 * - `target:"/a/saku"` only finds exact matches
 * - General search (`"/a/saku"`) searches across all fields and works
 *
 * **Our approach:**
 * 1. Use general search to find redirects containing the app proxy path
 * 2. Filter client-side to only include redirects targeting our exact app proxy
 * 3. Build exact target queries for bulk delete (e.g., `target:"/a/saku/bio" OR target:"/a/saku/blog"`)
 *
 * This handles redirects like `/a/saku/bio`, `/a/saku/blog`, etc. while avoiding false positives
 * like `/a/saku-local/` (different app instance).
 *
 * @param config - Configuration containing shop ID and access token
 * @returns Result containing information about the cleanup operation
 */
export async function removeAppProxyRedirects(
	config: TRemoveAppProxyRedirectsConfig
): Promise<TResult<TRemoveAppProxyRedirectsSuccess, AppError>> {
	const { shopId, accessToken } = config;
	const appProxyPath = shopifyConfig.proxy.path as `/${string}`;

	// Step 1: Search for redirects that might contain our app proxy path
	const searchResult = await searchUrlRedirects(
		{
			first: 250, // Maximum allowed by Shopify
			query: appProxyPath // General search finds redirects in any field
		},
		{ shopId, accessToken }
	);
	if (searchResult.isErr()) {
		return Err(
			new AppError('#ERR_SEARCH_FAILED', 500, {
				detail: 'Failed to search URL redirects'
			})
		);
	}

	// Step 2: Filter redirects to only those targeting our exact app proxy path
	const redirectsToDelete = searchResult.value.urlRedirects.filter(
		(redirect) => redirect.target.startsWith(`${appProxyPath}/`) || redirect.target === appProxyPath
	);
	if (redirectsToDelete.length === 0) {
		return Ok({
			redirectsFound: searchResult.value.urlRedirects.length,
			redirectsDeleted: 0,
			appProxyPath,
			message: 'No redirects found targeting the app proxy'
		});
	}

	// Step 3: Execute bulk delete with exact target matches
	const bulkDeleteResult = await bulkDeleteUrlRedirectsBySearch(
		// We need exact matches since wildcards don't work on the target field
		{ search: redirectsToDelete.map((redirect) => `target:"${redirect.target}"`).join(' OR ') },
		{ shopId, accessToken }
	);
	if (bulkDeleteResult.isErr()) {
		return Err(bulkDeleteResult.error);
	}

	return Ok({
		redirectsFound: searchResult.value.urlRedirects.length,
		redirectsDeleted: redirectsToDelete.length,
		appProxyPath,
		job: bulkDeleteResult.value.job,
		message: `Found ${searchResult.value.urlRedirects.length} potential redirects, queued ${redirectsToDelete.length} for deletion`
	});
}

export interface TRemoveAppProxyRedirectsConfig {
	shopId: string;
	accessToken: string;
}

export interface TRemoveAppProxyRedirectsSuccess {
	redirectsFound: number;
	redirectsDeleted: number;
	appProxyPath: `/${string}`;
	job?: {
		id: string;
		done: boolean;
	};
	message: string;
}
