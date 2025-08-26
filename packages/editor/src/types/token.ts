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
export type TTokenType = TToken['type'];

export type TTokenGroupMap<GToken extends TToken = TToken> = {
	[K in GToken['type']]?: TTokenSet<Extract<GToken, { type: K }>>;
};

export type TTokenSet<GToken extends TToken = TToken> = {
	[key: string]: GToken['value'];
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
