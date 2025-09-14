import { TAppearanceStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const APPEARANCE_PROPERTIES: readonly (keyof TUnreferenceTop<TAppearanceStyleMixin['value']>)[] = [
	'visible',
	'opacity',
	'borderRadius'
];

export function unpackAppearanceTokenRef(
	text: TAppearanceStyleMixin['value']
): TUnreferenceTop<TAppearanceStyleMixin['value']> {
	return unpackTokenRef(text, APPEARANCE_PROPERTIES);
}

export function packAppearanceTokenRef(
	text: TUnreferenceTop<TAppearanceStyleMixin['value']>
): TAppearanceStyleMixin['value'] {
	return packTokenRef(text, APPEARANCE_PROPERTIES);
}
