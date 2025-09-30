import { TStrokeStyleMixin, TUnreferenceTop } from '@repo/editor';
import { packTokenRef, unpackTokenRef } from '../../lib';

const STROKE_PROPERTIES: readonly (keyof TUnreferenceTop<
	NonNullable<TStrokeStyleMixin['value']>
>)[] = ['width', 'paint'];

export function unpackStrokeTokenRef(
	stroke: TStrokeStyleMixin['value']
): TUnreferenceTop<TStrokeStyleMixin['value']> {
	return unpackTokenRef(stroke, STROKE_PROPERTIES);
}

export function packStrokeTokenRef(
	stroke: TUnreferenceTop<TStrokeStyleMixin['value']>
): TStrokeStyleMixin['value'] {
	return packTokenRef(stroke, STROKE_PROPERTIES);
}
