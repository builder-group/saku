import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { shopifyConfig } from '@/environment';
import { searchUrlRedirects } from '../gql';
import { isUrlRedirectPathReserved } from './is-url-redirect-path-reserved';

/**
 * Checks if a URL redirect path is available for use.
 *
 * This function validates:
 * 1. Path is not a reserved Shopify path
 * 2. Path is not already used by an existing redirect
 *
 * @param path - The URL path to check (e.g., "/my-custom-path")
 * @param config - The configuration for the check
 * @returns Result indicating if the path is available and any conflicts found
 */
export async function checkUrlRedirectAvailability(
	path: `/${string}`,
	config: TCheckUrlRedirectAvailabilityConfig
): Promise<TResult<TUrlRedirectAvailabilityResult, AppError>> {
	const { shopId, accessToken } = config;

	// Validate path is provided
	if (!path.length) {
		return Err(
			new AppError('#ERR_INVALID_PATH', 400, {
				detail: 'Path must be a non-empty string'
			})
		);
	}

	const normalizedPath: `/${string}` = path.startsWith('/') ? path : `/${path}`;

	// Check if path is reserved
	if (isUrlRedirectPathReserved(normalizedPath)) {
		return Ok({
			isAvailable: false,
			conflictType: 'reserved_path',
			conflictReason: `Path "${normalizedPath}" conflicts with Shopify reserved paths`,
			reservedPaths: shopifyConfig.reservedPaths,
			existingRedirects: []
		});
	}

	// Search for existing redirects with this exact path
	const searchResult = await searchUrlRedirects(
		{
			query: { path: normalizedPath },
			first: 5 // We only need a few results to check for conflicts
		},
		{
			shopId,
			accessToken
		}
	);
	if (searchResult.isErr()) {
		return Err(searchResult.error);
	}

	const existingRedirects = searchResult.value.urlRedirects;

	// Check if any existing redirect has the exact same path
	const exactMatch = existingRedirects.find((redirect) => redirect.path === normalizedPath);
	if (exactMatch) {
		return Ok({
			isAvailable: false,
			conflictType: 'existing_redirect',
			conflictReason: `Path "${normalizedPath}" is already used by an existing redirect`,
			existingRedirects: [exactMatch],
			reservedPaths: []
		});
	}

	// Path is available
	return Ok({
		isAvailable: true,
		conflictType: null,
		conflictReason: null,
		existingRedirects: [],
		reservedPaths: []
	});
}

interface TCheckUrlRedirectAvailabilityConfig {
	shopId: string;
	accessToken: string;
}

export interface TUrlRedirectAvailabilityResult {
	isAvailable: boolean;
	conflictType: 'reserved_path' | 'existing_redirect' | null;
	conflictReason: string | null;
	existingRedirects: Array<{
		id: string;
		path: string;
		target: string;
	}>;
	reservedPaths: string[];
}
