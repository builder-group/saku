import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { shopifyConfig } from '@/environment';
import {
	createUrlRedirect,
	searchUrlRedirects,
	updateUrlRedirect,
	type TUrlRedirectCreateSuccess
} from '../gql';
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
	const { shopId, accessToken, override = false } = config;

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

	// If creation failed due to path conflict and override is true, try to update existing redirect
	if (result.isErr() && result.error.code === '#ERR_REDIRECT_PATH_TAKEN' && override) {
		// Find existing redirect
		const findResult = await searchUrlRedirects(
			{
				first: 1,
				query: { path: normalizedPath }
			},
			{ shopId, accessToken }
		);
		if (findResult.isErr()) {
			return Err(
				new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
					detail: `Failed to find existing redirect: ${findResult.error.message}`
				})
			);
		}

		const existingRedirect = findResult.value.urlRedirects[0];
		if (existingRedirect == null) {
			return Err(
				new AppError('#ERR_REDIRECT_NOT_FOUND', 404, {
					detail: `Could not find redirect with path '${normalizedPath}'`
				})
			);
		}

		// Update existing redirect
		const updateResult = await updateUrlRedirect(
			{
				id: existingRedirect.id,
				path: normalizedPath,
				target: normalizedTarget
			},
			{
				shopId,
				accessToken
			}
		);
		if (updateResult.isErr()) {
			return Err(
				new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
					detail: `Failed to update redirect: ${updateResult.error.message}`
				})
			);
		}

		return Ok({
			id: updateResult.value.id,
			path: updateResult.value.path,
			target: updateResult.value.target
		});
	}

	return result;
}

interface TCreateShopifyUrlRedirectConfig {
	shopId: string;
	accessToken: string;
	override?: boolean;
}
