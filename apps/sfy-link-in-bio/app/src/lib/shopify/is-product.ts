import type { Product, ProductVariant } from '@shopify/app-bridge-types';

export function isProduct(value: unknown): value is Product {
	return (
		value != null &&
		typeof value === 'object' &&
		'id' in value &&
		'title' in value &&
		'productType' in value
	);
}

export function isProductVariant(value: unknown): value is ProductVariant {
	return (
		value != null &&
		typeof value === 'object' &&
		'id' in value &&
		'title' in value &&
		'product' in value
	);
}
