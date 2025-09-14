import { TProductDetailsStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const PRODUCT_DETAILS_PROPERTIES: readonly (keyof TUnreferenceTop<
	TProductDetailsStyleMixin['value']
>)[] = ['appearance', 'fill', 'stroke', 'shadow', 'textXl', 'text', 'buttonPrimary', 'image'];

export function unpackProductDetailsTokenRef(
	productDetails: TProductDetailsStyleMixin['value']
): TUnreferenceTop<TProductDetailsStyleMixin['value']> {
	return unpackTokenRef(productDetails, PRODUCT_DETAILS_PROPERTIES);
}

export function packProductDetailsTokenRef(
	productDetails: TUnreferenceTop<TProductDetailsStyleMixin['value']>
): TProductDetailsStyleMixin['value'] {
	return packTokenRef(productDetails, PRODUCT_DETAILS_PROPERTIES);
}
