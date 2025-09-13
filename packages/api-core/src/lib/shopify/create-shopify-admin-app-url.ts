/**
 * Creates a Shopify admin app URL
 *
 * @param shop - Shopify domain (e.g., "builder-group-dev-store.myshopify.com")
 * @param appHandle - App handle (e.g., "saku-link-in-bio")
 * @param path - Optional path within the app (e.g., "/dashboard", "/settings")
 *
 * @returns Complete Shopify admin app URL
 *
 * @example
 * createShopifyAdminAppUrl("builder-group-dev-store.myshopify.com", "saku-link-in-bio", "/app")
 * // Returns: "https://admin.shopify.com/store/builder-group-dev-store/apps/saku-link-in-bio/app"
 */
export function createShopifyAdminAppUrl(
	shop: string,
	appHandle: string,
	path: string = ''
): string {
	// Remove .myshopify.com from the shop domain
	const shopHandle = shop.replace('.myshopify.com', '');

	// Ensure path starts with / if provided
	const normalizedPath = path && !path.startsWith('/') ? `/${path}` : path;

	// Construct the Shopify admin app URL
	return `https://admin.shopify.com/store/${shopHandle}/apps/${appHandle}${normalizedPath}`;
}
