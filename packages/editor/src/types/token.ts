import {
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TBadgeStyleMixin,
	TBaseMixin,
	TButtonStyleMixin,
	TFillStyleMixin,
	TImageStyleMixin,
	TProductDetailsStyleMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextStyleMixin,
	TTypographyStyleMixin
} from './mixin';
import { TUnreference } from './ref';

export type TToken = TVariableToken | TMixinToken;
export type TTokenType = TToken['type'];

export type TTokenMap = TMixinTokenMap<TMixinToken> & TVariableTokenMap;
export type TTokenKey = TMixinTokenKey | TVariableTokenKey;

export interface TTokenRef {
	type: 'token';
	tokenType: TTokenType;
	key: string;
}

// =========================================================================
// Variable tokens (atomic design values)
// =========================================================================

export interface TVariableToken<
	GValue extends string | number | boolean = string | number | boolean
> {
	type: 'variable';
	key: string;
	name?: string;
	value: GValue;
}

export type TVariableTokenMap = Record<`variable.${string}`, TVariableToken>;
export type TVariableTokenKey = `variable.${string}`;

// =========================================================================
// Mixin tokens (component style definitions)
// =========================================================================

export type TMixinToken =
	| TAutoLayoutStyleToken
	| TAppearanceStyleToken
	| TTypographyStyleToken
	| TFillStyleToken
	| TStrokeStyleToken
	| TShadowStyleToken
	| TTextStyleToken
	| TButtonStyleToken
	| TBadgeStyleToken
	| TImageStyleToken
	| TProductDetailsStyleToken;

export interface TBaseMixinToken<GMixin extends TBaseMixin<any, any>> {
	type: 'mixin';
	key: string;
	name?: string;
	mixinKey: GMixin['key'];
	value: TUnreference<GMixin['value']>;
}

export type TMixinTokenMap<GMixinToken extends TMixinToken = TMixinToken> = {
	[K in `mixin.${GMixinToken['mixinKey']}.${string}`]: Extract<
		GMixinToken,
		{ mixinKey: K extends `mixin.${infer MKey}.${string}` ? MKey : never }
	>;
};

export type TMixinTokenKey<GMixinToken extends TMixinToken = TMixinToken> =
	`mixin.${GMixinToken['mixinKey']}.${string}`;

export type TMixinTokenGroupMap<GMixinToken extends TMixinToken = TMixinToken> = {
	[K in GMixinToken['mixinKey']]?: TMixinTokenSet<Extract<GMixinToken, { mixinKey: K }>>;
};

export type TMixinTokenSet<GMixinToken extends TMixinToken = TMixinToken> = Record<
	string,
	GMixinToken
>;

export type TAutoLayoutStyleToken = TBaseMixinToken<TAutoLayoutStyleMixin>;
export type TAppearanceStyleToken = TBaseMixinToken<TAppearanceStyleMixin>;
export type TTypographyStyleToken = TBaseMixinToken<TTypographyStyleMixin>;
export type TFillStyleToken = TBaseMixinToken<TFillStyleMixin>;
export type TStrokeStyleToken = TBaseMixinToken<TStrokeStyleMixin>;
export type TShadowStyleToken = TBaseMixinToken<TShadowStyleMixin>;
export type TTextStyleToken = TBaseMixinToken<TTextStyleMixin>;
export type TButtonStyleToken = TBaseMixinToken<TButtonStyleMixin>;
export type TBadgeStyleToken = TBaseMixinToken<TBadgeStyleMixin>;
export type TImageStyleToken = TBaseMixinToken<TImageStyleMixin>;
export type TProductDetailsStyleToken = TBaseMixinToken<TProductDetailsStyleMixin>;
