import { TTypographyStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const TYPOGRAPHY_PROPERTIES: readonly (keyof TUnreferenceTop<TTypographyStyleMixin['value']>)[] = [
	'font',
	'fontSize',
	'textAlignHorizontal',
	'textAlignVertical',
	'lineHeight',
	'letterSpacing'
];

export function unpackTypographyTokenRef(
	typography: TTypographyStyleMixin['value']
): TUnreferenceTop<TTypographyStyleMixin['value']> {
	return unpackTokenRef(typography, TYPOGRAPHY_PROPERTIES);
}

export function packTypographyTokenRef(
	typography: TUnreferenceTop<TTypographyStyleMixin['value']>
): TTypographyStyleMixin['value'] {
	return packTokenRef(typography, TYPOGRAPHY_PROPERTIES);
}
