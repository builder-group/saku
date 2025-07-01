/**
 * Converts a Shopify domain to a display name
 * e.g. "builder-group-dev-store.myshopify.com" -> "Builder Group Dev Store"
 */
export function createDisplayNameFromShop(shop: string): string {
	return shop
		.replace('.myshopify.com', '')
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
