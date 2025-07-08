import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { shopifyConfig } from '@/environment';
import { createUrlRedirect, type TUrlRedirectCreateSuccess } from '../gql';
import { isUrlRedirectPathReserved } from './is-url-redirect-path-reserved';

/**
 * Creates a URL redirect with path validation.
 *
 * @param shopId - The Shopify shop ID
 * @param accessToken - The access token for the shop
 * @param path - The URL redirect path
 * @param target - The URL redirect target
 * @returns The created URL redirect
 */
export async function createShopifyUrlRedirect(
	path: `/${string}`,
	target: `/${string}`,
	config: TCreateShopifyUrlRedirectConfig
): Promise<TResult<TUrlRedirectCreateSuccess, AppError>> {
	const { shopId, accessToken } = config;

	// Validate path is provided
	if (!path.length || !target.length) {
		return Err(
			new AppError('#ERR_INVALID_PATH', 400, {
				detail: 'Path must be a non-empty string'
			})
		);
	}

	const normalizedPath: `/${string}` = path.startsWith('/') ? path : `/${path}`;
	const normalizedTarget: `/${string}` = target.startsWith('/') ? target : `/${target}`;

	// Check if path is reserved
	if (isUrlRedirectPathReserved(normalizedPath)) {
		return Err(
			new AppError('#ERR_RESERVED_PATH', 400, {
				detail: `Path "${normalizedPath}" conflicts with Shopify reserved paths. Reserved paths: ${shopifyConfig.reservedPaths.join(', ')}`
			})
		);
	}

	// Create the URL redirect
	const result = await createUrlRedirect(
		{
			path: normalizedPath,
			target: normalizedTarget
		},
		{
			shopId,
			accessToken
		}
	);
	if (result.isErr()) {
		return result;
	}

	return Ok(result.value);
}

interface TCreateShopifyUrlRedirectConfig {
	shopId: string;
	accessToken: string;
}
