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

export type TTokens = TTokensFromMixin<
	| TAutoLayoutStyleMixin
	| TAppearanceStyleMixin
	| TTypographyStyleMixin
	| TFillStyleMixin
	| TStrokeStyleMixin
	| TShadowStyleMixin
	| TTextStyleMixin
	| TButtonStyleMixin
>;

export type TTokensFromMixin<GMixin extends TBaseMixin<any, any>> = {
	[K in GMixin['key']]?: Record<string, Extract<GMixin, { key: K }>['value']>;
};
