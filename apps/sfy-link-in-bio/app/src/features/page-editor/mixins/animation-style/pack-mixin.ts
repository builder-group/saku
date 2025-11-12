import { TAnimationStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const ANIMATION_PROPERTIES: readonly (keyof TUnreferenceTop<
	NonNullable<TAnimationStyleMixin['value']>
>)[] = ['animation'];

export function unpackAnimationTokenRef(
	animation: TAnimationStyleMixin['value']
): TUnreferenceTop<TAnimationStyleMixin['value']> {
	return unpackTokenRef(animation, ANIMATION_PROPERTIES);
}

export function packAnimationTokenRef(
	animation: TUnreferenceTop<TAnimationStyleMixin['value']>
): TAnimationStyleMixin['value'] {
	return packTokenRef(animation, ANIMATION_PROPERTIES);
}
