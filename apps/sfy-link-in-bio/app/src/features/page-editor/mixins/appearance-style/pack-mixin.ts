import { TAppearanceStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const APPEARANCE_PROPERTIES: readonly (keyof TUnreferenceTop<TAppearanceStyleMixin['value']>)[] = [
	'visible',
	'opacity',
	'borderRadius'
];

export function unpackAppearanceTokenRef(
	appearance: TAppearanceStyleMixin['value']
): TUnreferenceTop<TAppearanceStyleMixin['value']> {
	return unpackTokenRef(appearance, APPEARANCE_PROPERTIES);
}

export function packAppearanceTokenRef(
	appearance: TUnreferenceTop<TAppearanceStyleMixin['value']>
): TAppearanceStyleMixin['value'] {
	return packTokenRef(appearance, APPEARANCE_PROPERTIES);
}
