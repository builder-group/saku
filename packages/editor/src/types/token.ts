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
import { TFont, TPaint } from './utils';

export interface TBaseToken {
	type: string;
	key: string;
	name?: string;
}

export type TToken = TAtomicToken | TMixinToken;

export interface TTokenRef {
	type: TToken['type'];
	key: TToken['key'];
	mapped?: boolean; // If true, this token reference should be mapped to extract a property
}

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
	| TAutoLayoutToken
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

export interface TAutoLayoutToken extends TBaseToken {
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
