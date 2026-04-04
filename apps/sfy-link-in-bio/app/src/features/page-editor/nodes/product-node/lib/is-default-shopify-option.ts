/**
 * Shopify creates a single "Default Title" option for products with no real variants.
 * These should be hidden from the UI because there's no meaningful choice to present.
 */
export function isDefaultShopifyOption(option: { name: string; values: string[] }): boolean {
	return option.values.length === 1 && option.values[0] === 'Default Title';
}
