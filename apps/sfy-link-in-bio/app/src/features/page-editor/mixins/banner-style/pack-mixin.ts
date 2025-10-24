import { TBannerStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const BADGE_PROPERTIES: readonly (keyof TUnreferenceTop<TBannerStyleMixin['value']>)[] = [
	'appearance',
	'fill',
	'stroke',
	'shadow',
	'text'
];

export function unpackBannerTokenRef(
	banner: TBannerStyleMixin['value']
): TUnreferenceTop<TBannerStyleMixin['value']> {
	return unpackTokenRef(banner, BADGE_PROPERTIES);
}

export function packBannerTokenRef(
	banner: TUnreferenceTop<TBannerStyleMixin['value']>
): TBannerStyleMixin['value'] {
	return packTokenRef(banner, BADGE_PROPERTIES);
}
