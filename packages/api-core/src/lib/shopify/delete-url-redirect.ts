import { AppError } from '@repo/hono-utils';
import { Err, type TResult } from 'tuple-result';
import { deleteUrlRedirect, searchUrlRedirects, type TUrlRedirectDeleteSuccess } from '../gql';

/**
 * Deletes a URL redirect by ID or by finding it first using path.
 *
 * @param config - Configuration object with either id or path
 * @returns The deleted URL redirect ID
 */
export async function deleteShopifyUrlRedirect(
	config: TDeleteShopifyUrlRedirectConfig
): Promise<TResult<TUrlRedirectDeleteSuccess, AppError>> {
	const { shopId, accessToken, id, path } = config;

	// If ID is provided, delete directly
	if (id != null) {
		return await deleteUrlRedirect({ id }, { shopId, accessToken });
	}

	// If path is provided, find and delete
	if (path != null) {
		const normalizedPath: `/${string}` = path.startsWith('/') ? path : `/${path}`;

		// Find existing redirects
		const findResult = await searchUrlRedirects(
			{
				first: 1,
				query: { path: normalizedPath }
			},
			{ shopId, accessToken }
		);
		if (findResult.isErr()) {
			return Err(findResult.error);
		}

		// Check if redirect exists
		const existingRedirectId = findResult.value.urlRedirects[0]?.id;
		if (existingRedirectId == null) {
			return Err(
				new AppError('#ERR_REDIRECT_NOT_FOUND', 404, {
					detail: `Could not find redirect with path '${normalizedPath}'`
				})
			);
		}

		// Delete the redirect
		return await deleteUrlRedirect({ id: existingRedirectId }, { shopId, accessToken });
	}

	// This should never be reached due to the validation above
	return Err(
		new AppError('#ERR_INVALID_INPUT', 400, {
			detail: 'Either id or path must be provided'
		})
	);
}

interface TDeleteShopifyUrlRedirectConfig {
	shopId: string;
	accessToken: string;
	id?: string;
	path?: `/${string}`;
}
