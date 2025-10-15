import { TNode, TNodeId } from './node';
import { TRef } from './ref';
import { TAutoLayoutStyleToken } from './token';
import { TFont, TLetterSpacing, TLineHeight, TPaint, TSolidPaint, TTextAlign } from './utils';

export interface TBaseMixin<GKey extends string, GValue> {
	key: GKey;
	value: GValue;
}

export type TMergeMixins<GMixins extends TBaseMixin<any, any>[]> = {
	[K in GMixins[number]['key']]: Extract<GMixins[number], { key: K }>['value'];
};

// =========================================================================
// Common
// =========================================================================

export type TIdMixin = TBaseMixin<'id', TNodeId>;
export type TChildrenMixin = TBaseMixin<'children', TNode[]>;
export type TFlatChildrenMixin = TBaseMixin<'children', TNodeId[]>;

// =========================================================================
// Primitive Style
// =========================================================================

// export type TLayoutStyleMixin = TBaseMixin<
// 	'layout',
// 	{
// 		width: number;
// 		height: number;
// 		clipContent?: boolean;
// 	}
// >;

export type TAutoLayoutStyleMixin = TBaseMixin<
	'autoLayout',
	TRef<
		{
			horizontalPadding?: TRef<number | undefined>;
			verticalPadding?: TRef<number | undefined>;
			horizontalMargin?: TRef<number | undefined>;
			verticalMargin?: TRef<number | undefined>;
			horizontalGap?: TRef<number | undefined>;
			verticalGap?: TRef<number | undefined>;
		},
		TAutoLayoutStyleToken
	>
>;

export type TAppearanceStyleMixin = TBaseMixin<
	'appearance',
	TRef<{
		visible: TRef<boolean>;
		opacity: TRef<number>;
		borderRadius?: TRef<number | undefined>;
	}>
>;

export type TTypographyStyleMixin = TBaseMixin<
	'typography',
	TRef<{
		font: TRef<TFont>;
		fontSize: TRef<number>;
		textAlignHorizontal: TRef<TTextAlign>;
		textAlignVertical: TRef<TTextAlign>;
		lineHeight: TRef<TLineHeight>;
		letterSpacing: TRef<TLetterSpacing>;
	}>
>;

export type TFillStyleMixin = TBaseMixin<
	'fill',
	TRef<{
		paint: TRef<TPaint>;
		opacity: TRef<number>;
	} | null>
>;

export type TStrokeStyleMixin = TBaseMixin<
	'stroke',
	TRef<{
		width: TRef<number>;
		paint: TRef<TSolidPaint>;
	} | null>
>;

export type TShadowStyleMixin = TBaseMixin<
	'shadow',
	TRef<{
		paint: TRef<TSolidPaint>;
		offsetX: TRef<number>;
		offsetY: TRef<number>;
		blur: TRef<number>;
		spread: TRef<number>;
	} | null>
>;

// =========================================================================
// Composed Style
// =========================================================================

export type TCardStyleMixin = TBaseMixin<
	'card',
	TRef<{
		autoLayout: TAutoLayoutStyleMixin['value'];
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}>
>;

export type TTextStyleMixin = TBaseMixin<
	'text',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		typography: TTypographyStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}>
>;
export type TTextXlStyleMixin = TBaseMixin<'textXl', TTextStyleMixin['value']>;
export type TTextSmStyleMixin = TBaseMixin<'textSm', TTextStyleMixin['value']>;

export type TButtonStyleMixin = TBaseMixin<
	'button',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
		text: TTextStyleMixin['value'];
	}>
>;
export type TButtonPrimaryStyleMixin = TBaseMixin<'buttonPrimary', TButtonStyleMixin['value']>;
export type TButtonNeutralStyleMixin = TBaseMixin<'buttonNeutral', TButtonStyleMixin['value']>;

export type TBadgeStyleMixin = TBaseMixin<
	'badge',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
		text: TTextStyleMixin['value'];
	}>
>;
export type TBadgeSecondaryStyleMixin = TBaseMixin<'badgeSecondary', TBadgeStyleMixin['value']>;
export type TBadgeNeutralStyleMixin = TBaseMixin<'badgeNeutral', TBadgeStyleMixin['value']>;

export type TImageStyleMixin = TBaseMixin<
	'image',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}>
>;

export type TEmbedStyleMixin = TBaseMixin<
	'embed',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
	}>
>;

export type TProductDetailsStyleMixin = TBaseMixin<
	'productDetails',
	TRef<{
		appearance: TAppearanceStyleMixin['value'];
		fill: TFillStyleMixin['value'];
		stroke: TStrokeStyleMixin['value'];
		shadow: TShadowStyleMixin['value'];
		textXl: TTextXlStyleMixin['value'];
		text: TTextStyleMixin['value'];
		buttonPrimary: TButtonPrimaryStyleMixin['value'];
		image: TImageStyleMixin['value'];
	}>
>;
