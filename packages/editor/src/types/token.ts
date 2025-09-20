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
import { TUnreference } from './ref';
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
	value: TUnreference<TAppearanceStyleMixin['value']>;
	// value: TUnreferenceTop<TAppearanceStyleMixin['value']>; // TODO: Unreference top at some point so we can use other variables inside variables
}

export interface TTypographyStyleToken extends TBaseToken {
	type: 'typography';
	value: TUnreference<TTypographyStyleMixin['value']>;
}

export interface TFillStyleToken extends TBaseToken {
	type: 'fill';
	value: TUnreference<TFillStyleMixin['value']>;
}

export interface TStrokeStyleToken extends TBaseToken {
	type: 'stroke';
	value: TUnreference<TStrokeStyleMixin['value']>;
}

export interface TShadowStyleToken extends TBaseToken {
	type: 'shadow';
	value: TUnreference<TShadowStyleMixin['value']>;
}

export interface TTextStyleToken extends TBaseToken {
	type: 'text';
	value: TUnreference<TTextStyleMixin['value']>;
}

export interface TButtonStyleToken extends TBaseToken {
	type: 'button';
	value: TUnreference<TButtonStyleMixin['value']>;
}

export interface TBadgeStyleToken extends TBaseToken {
	type: 'badge';
	value: TUnreference<TBadgeStyleMixin['value']>;
}

export interface TImageStyleToken extends TBaseToken {
	type: 'image';
	value: TUnreference<TImageStyleMixin['value']>;
}

export interface TProductDetailsStyleToken extends TBaseToken {
	type: 'product-details';
	value: TUnreference<TProductDetailsStyleMixin['value']>;
}
