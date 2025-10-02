import { TFillStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const FILL_PROPERTIES: readonly (keyof TUnreferenceTop<NonNullable<TFillStyleMixin['value']>>)[] = [
	'paint',
	'opacity'
];

export function unpackFillTokenRef(
	fill: TFillStyleMixin['value']
): TUnreferenceTop<TFillStyleMixin['value']> {
	return unpackTokenRef(fill, FILL_PROPERTIES);
}

export function packFillTokenRef(
	fill: TUnreferenceTop<TFillStyleMixin['value']>
): TFillStyleMixin['value'] {
	return packTokenRef(fill, FILL_PROPERTIES);
}
