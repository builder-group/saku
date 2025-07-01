/**
 * Converts a Shopify domain to a handle by removing the .myshopify.com suffix
 * e.g. "builder-group-dev-store.myshopify.com" -> "builder-group-dev-store"
 */
export function createHandleFromShop(shop: string): string {
	return shop.replace('.myshopify.com', '');
}
