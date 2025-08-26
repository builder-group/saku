import {
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TBaseMixin,
	TButtonStyleMixin,
	TFillStyleMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextStyleMixin,
	TTypographyStyleMixin
} from './mixin';
import { TUnreference } from './ref';

export type TToken =
	| TAutoLayoutStyleToken
	| TAppearanceStyleToken
	| TTypographyStyleToken
	| TFillStyleToken
	| TStrokeStyleToken
	| TShadowStyleToken
	| TTextStyleToken
	| TButtonStyleToken;

export type TTokenMap = TTokenMapFromToken<TToken>;
export type TTokenType = TToken['type'];

export type TTokenMapFromToken<GToken extends TToken> = {
	[K in GToken['type']]?: Record<string, Extract<GToken, { type: K }>['value']>;
};

export type TBaseToken<GMixin extends TBaseMixin<any, any>> = {
	type: GMixin['key'];
	key: string;
	name?: string;
	value: TUnreference<GMixin['value']>;
};

export type TAutoLayoutStyleToken = TBaseToken<TAutoLayoutStyleMixin>;
export type TAppearanceStyleToken = TBaseToken<TAppearanceStyleMixin>;
export type TTypographyStyleToken = TBaseToken<TTypographyStyleMixin>;
export type TFillStyleToken = TBaseToken<TFillStyleMixin>;
export type TStrokeStyleToken = TBaseToken<TStrokeStyleMixin>;
export type TShadowStyleToken = TBaseToken<TShadowStyleMixin>;
export type TTextStyleToken = TBaseToken<TTextStyleMixin>;
export type TButtonStyleToken = TBaseToken<TButtonStyleMixin>;
