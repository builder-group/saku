import { shopifyConfig } from '@/environment';

/**
 * Validates if a URL path conflicts with Shopify's reserved paths.
 */
export function isUrlRedirectPathReserved(path: string): boolean {
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return shopifyConfig.reservedPaths.some(
		(reserved) => normalizedPath.startsWith(reserved + '/') || normalizedPath === reserved
	);
}
