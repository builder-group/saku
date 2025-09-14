import { TTextStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const TEXT_PROPERTIES: readonly (keyof TUnreferenceTop<TTextStyleMixin['value']>)[] = [
	'appearance',
	'typography',
	'fill',
	'stroke',
	'shadow'
];

export function unpackTextTokenRef(
	text: TTextStyleMixin['value']
): TUnreferenceTop<TTextStyleMixin['value']> {
	return unpackTokenRef(text, TEXT_PROPERTIES);
}

export function packTextTokenRef(
	text: TUnreferenceTop<TTextStyleMixin['value']>
): TTextStyleMixin['value'] {
	return packTokenRef(text, TEXT_PROPERTIES);
}
