import { TImageStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const IMAGE_PROPERTIES: readonly (keyof TUnreferenceTop<TImageStyleMixin['value']>)[] = [
	'appearance',
	'stroke',
	'shadow'
];

export function unpackImageTokenRef(
	image: TImageStyleMixin['value']
): TUnreferenceTop<TImageStyleMixin['value']> {
	return unpackTokenRef(image, IMAGE_PROPERTIES);
}

export function packImageTokenRef(
	image: TUnreferenceTop<TImageStyleMixin['value']>
): TImageStyleMixin['value'] {
	return packTokenRef(image, IMAGE_PROPERTIES);
}
