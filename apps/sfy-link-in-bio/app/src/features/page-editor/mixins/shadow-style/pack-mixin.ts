import { TShadowStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const SHADOW_PROPERTIES: readonly (keyof TUnreferenceTop<
	NonNullable<TShadowStyleMixin['value']>
>)[] = ['paint', 'offsetX', 'offsetY', 'blur', 'spread'];

export function unpackShadowTokenRef(
	shadow: TShadowStyleMixin['value']
): TUnreferenceTop<TShadowStyleMixin['value']> {
	return unpackTokenRef(shadow, SHADOW_PROPERTIES);
}

export function packShadowTokenRef(
	shadow: TUnreferenceTop<TShadowStyleMixin['value']>
): TShadowStyleMixin['value'] {
	return packTokenRef(shadow, SHADOW_PROPERTIES);
}
