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
import { TRef, TUnreference, TUnreferenceTop } from './ref';
import { TFont, TPaint } from './utils';

export interface TBaseToken {
	type: string;
	key: string;
	name?: string;
}

export type TToken = TAtomicToken | TMixinToken;

export interface TTokenRef<GToken extends TToken = TToken> {
	type: 'token';
	key: GToken['key'];
	tokenType?: GToken['type'];
	path?: TTokenPaths<GToken>;
}

export type TTokenPaths<GToken extends TToken> = TPaths<GToken['value']>;

type TPaths<T> = T extends TTokenRef
	? never // Skip token references to avoid circular dependencies
	: T extends object
		? {
				[K in keyof T]: `${Exclude<K, symbol>}${'' | `.${TPaths<T[K]>}`}`;
			}[keyof T]
		: never;

export type TGetTokenValue<GToken extends TToken, GPath extends string> = TGet<
	GToken['value'],
	GPath
>;

type TGet<T, P extends string> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? T[K] extends TRef<infer U>
			? TGet<U, Rest>
			: TGet<T[K], Rest>
		: never
	: P extends keyof T
		? T[P] extends TRef<infer U>
			? U
			: T[P]
		: never;

// =========================================================================
// Atomic Tokens
// =========================================================================

export type TAtomicToken =
	| TStringToken
	| TNumberToken
	| TBooleanToken
	| TColorToken
	| TPaintToken
	| TFontToken;

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

export interface TPaintToken extends TBaseToken {
	type: 'paint';
	value: TPaint;
}

export interface TFontToken extends TBaseToken {
	type: 'font';
	value: TFont;
}

// =========================================================================
// Mixin Tokens
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

export interface TAutoLayoutStyleToken extends TBaseToken {
	type: 'auto-layout';
	value: TUnreference<TAutoLayoutStyleMixin['value']>;
}

export interface TAppearanceStyleToken extends TBaseToken {
	type: 'appearance';
	value: TUnreferenceTop<TAppearanceStyleMixin['value']>;
}

export interface TTypographyStyleToken extends TBaseToken {
	type: 'typography';
	value: TUnreferenceTop<TTypographyStyleMixin['value']>;
}

export interface TFillStyleToken extends TBaseToken {
	type: 'fill';
	value: TUnreferenceTop<TFillStyleMixin['value']>;
}

export interface TStrokeStyleToken extends TBaseToken {
	type: 'stroke';
	value: TUnreferenceTop<TStrokeStyleMixin['value']>;
}

export interface TShadowStyleToken extends TBaseToken {
	type: 'shadow';
	value: TUnreferenceTop<TShadowStyleMixin['value']>;
}

export interface TTextStyleToken extends TBaseToken {
	type: 'text';
	value: TUnreferenceTop<TTextStyleMixin['value']>;
}

export interface TButtonStyleToken extends TBaseToken {
	type: 'button';
	value: TUnreferenceTop<TButtonStyleMixin['value']>;
}

export interface TBadgeStyleToken extends TBaseToken {
	type: 'badge';
	value: TUnreferenceTop<TBadgeStyleMixin['value']>;
}

export interface TImageStyleToken extends TBaseToken {
	type: 'image';
	value: TUnreferenceTop<TImageStyleMixin['value']>;
}

export interface TProductDetailsStyleToken extends TBaseToken {
	type: 'product-details';
	value: TUnreferenceTop<TProductDetailsStyleMixin['value']>;
}
