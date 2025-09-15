import { TButtonStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const BUTTON_PROPERTIES: readonly (keyof TUnreferenceTop<TButtonStyleMixin['value']>)[] = [
	'appearance',
	'fill',
	'stroke',
	'shadow',
	'text'
];

export function unpackButtonTokenRef(
	button: TButtonStyleMixin['value']
): TUnreferenceTop<TButtonStyleMixin['value']> {
	return unpackTokenRef(button, BUTTON_PROPERTIES);
}

export function packButtonTokenRef(
	button: TUnreferenceTop<TButtonStyleMixin['value']>
): TButtonStyleMixin['value'] {
	return packTokenRef(button, BUTTON_PROPERTIES);
}
