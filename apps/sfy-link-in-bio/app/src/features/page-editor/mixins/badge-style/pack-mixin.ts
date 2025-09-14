import { TBadgeStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const BADGE_PROPERTIES: readonly (keyof TUnreferenceTop<TBadgeStyleMixin['value']>)[] = [
	'appearance',
	'fill',
	'stroke',
	'shadow',
	'text'
];

export function unpackBadgeTokenRef(
	badge: TBadgeStyleMixin['value']
): TUnreferenceTop<TBadgeStyleMixin['value']> {
	return unpackTokenRef(badge, BADGE_PROPERTIES);
}

export function packBadgeTokenRef(
	badge: TUnreferenceTop<TBadgeStyleMixin['value']>
): TBadgeStyleMixin['value'] {
	return packTokenRef(badge, BADGE_PROPERTIES);
}
