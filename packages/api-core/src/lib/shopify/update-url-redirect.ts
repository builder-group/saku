import { AppError } from '@repo/hono-utils';
import { Err, type TResult } from 'tuple-result';
import { shopifyConfig } from '@/environment';
import {
	createUrlRedirect,
	searchUrlRedirects,
	updateUrlRedirect,
	type TUrlRedirectCreateSuccess,
	type TUrlRedirectUpdateSuccess
} from '../gql';
import { isUrlRedirectPathReserved } from './is-url-redirect-path-reserved';

/**
 * Creates or updates a URL redirect.
 * If oldPath is provided, it will update the existing redirect.
 * If oldPath is not provided, it will create a new redirect.
 *
 * @param path - The URL redirect path
 * @param target - The URL redirect target
 * @param config - Configuration object
 * @returns The created or updated URL redirect
 */
export async function updateShopifyUrlRedirect(
	path: `/${string}`,
	target: `/${string}`,
	config: TUpdateShopifyUrlRedirectConfig
): Promise<TResult<TUrlRedirectCreateSuccess | TUrlRedirectUpdateSuccess, AppError>> {
	const { shopId, accessToken, oldPath, override = false } = config;

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

	// Try to update existing redirect if oldPath is provided or override is true
	if (oldPath != null || override) {
		const searchPath = oldPath != null ? oldPath : normalizedPath;
		const normalizedSearchPath: `/${string}` = searchPath.startsWith('/')
			? searchPath
			: `/${searchPath}`;

		// Find existing redirects
		const findResult = await searchUrlRedirects(
			{
				first: 1,
				query: { path: normalizedSearchPath }
			},
			{ shopId, accessToken }
		);
		if (findResult.isErr()) {
			return Err(findResult.error);
		}

		// Update the existing redirect
		const existingRedirectId = findResult.value.urlRedirects[0]?.id;
		if (existingRedirectId != null) {
			return await updateUrlRedirect(
				{
					id: existingRedirectId,
					path: normalizedPath,
					target: normalizedTarget
				},
				{
					shopId,
					accessToken
				}
			);
		}
	}

	// Create new redirect
	return await createUrlRedirect(
		{
			path: normalizedPath,
			target: normalizedTarget
		},
		{
			shopId,
			accessToken
		}
	);
}

interface TUpdateShopifyUrlRedirectConfig {
	shopId: string;
	accessToken: string;
	oldPath?: `/${string}`;
	override?: boolean;
}
