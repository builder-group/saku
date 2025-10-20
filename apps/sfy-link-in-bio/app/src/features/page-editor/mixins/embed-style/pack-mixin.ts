import { TEmbedStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const EMBED_PROPERTIES: readonly (keyof TUnreferenceTop<TEmbedStyleMixin['value']>)[] = [
	'appearance',
	'stroke',
	'shadow'
];

export function unpackEmbedTokenRef(
	embed: TEmbedStyleMixin['value']
): TUnreferenceTop<TEmbedStyleMixin['value']> {
	return unpackTokenRef(embed, EMBED_PROPERTIES);
}

export function packEmbedTokenRef(
	embed: TUnreferenceTop<TEmbedStyleMixin['value']>
): TEmbedStyleMixin['value'] {
	return packTokenRef(embed, EMBED_PROPERTIES);
}
