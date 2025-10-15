import { TAutoLayoutStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const AUTO_LAYOUT_PROPERTIES: readonly (keyof TUnreferenceTop<TAutoLayoutStyleMixin['value']>)[] = [
	'horizontalPadding',
	'verticalPadding',
	'horizontalMargin',
	'verticalMargin',
	'horizontalGap',
	'verticalGap'
];

export function unpackAutoLayoutTokenRef(
	autoLayout: TAutoLayoutStyleMixin['value']
): TUnreferenceTop<TAutoLayoutStyleMixin['value']> {
	return unpackTokenRef(autoLayout, AUTO_LAYOUT_PROPERTIES);
}

export function packAutoLayoutTokenRef(
	autoLayout: TUnreferenceTop<TAutoLayoutStyleMixin['value']>
): TAutoLayoutStyleMixin['value'] {
	return packTokenRef(autoLayout, AUTO_LAYOUT_PROPERTIES);
}
