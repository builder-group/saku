import { TRgba } from '../lib';
import {
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TBadgeStyleMixin,
	TButtonStyleMixin,
	TFillStyleMixin,
	TImageStyleMixin,
	TProductDetailsStyleMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextStyleMixin,
	TTypographyStyleMixin
} from './mixin';
import { TUnreference, TUnreferenceTop } from './ref';

export interface TBaseToken {
	type: string;
	key: string;
	name?: string;
}

export type TToken =
	| TStringToken
	| TNumberToken
	| TBooleanToken
	| TColorToken
	| TAutoLayoutToken
	| TAppearanceToken
	| TTypographyToken
	| TFillToken
	| TStrokeToken
	| TShadowToken
	| TTextToken
	| TButtonToken
	| TBadgeToken
	| TImageToken
	| TProductDetailsToken;
export type TTokenType = TToken['type'];

export interface TTokenRef {
	type: TToken['type'];
	key: TToken['key'];
}

export interface TStringToken extends TBaseToken {
	type: 'string';
	value: string;
}

export interface TNumberToken extends TBaseToken {
	type: 'number';
	value: number;
}

export interface TBooleanToken extends TBaseToken {
	type: 'boolean';
	value: boolean;
}

export interface TColorToken extends TBaseToken {
	type: 'color';
	value: TRgba;
}

export interface TAutoLayoutToken extends TBaseToken {
	type: 'auto-layout';
	value: TUnreference<TAutoLayoutStyleMixin['value']>;
}

export interface TAppearanceToken extends TBaseToken {
	type: 'appearance';
	value: TUnreferenceTop<TAppearanceStyleMixin['value']>;
}

export interface TTypographyToken extends TBaseToken {
	type: 'typography';
	value: TUnreference<TTypographyStyleMixin['value']>;
}

export interface TFillToken extends TBaseToken {
	type: 'fill';
	value: TUnreference<TFillStyleMixin['value']>;
}

export interface TStrokeToken extends TBaseToken {
	type: 'stroke';
	value: TUnreference<TStrokeStyleMixin['value']>;
}

export interface TShadowToken extends TBaseToken {
	type: 'shadow';
	value: TUnreference<TShadowStyleMixin['value']>;
}

export interface TTextToken extends TBaseToken {
	type: 'text';
	value: TUnreference<TTextStyleMixin['value']>;
}

export interface TButtonToken extends TBaseToken {
	type: 'button';
	value: TUnreference<TButtonStyleMixin['value']>;
}

export interface TBadgeToken extends TBaseToken {
	type: 'badge';
	value: TUnreference<TBadgeStyleMixin['value']>;
}

export interface TImageToken extends TBaseToken {
	type: 'image';
	value: TUnreference<TImageStyleMixin['value']>;
}

export interface TProductDetailsToken extends TBaseToken {
	type: 'product-details';
	value: TUnreference<TProductDetailsStyleMixin['value']>;
}
