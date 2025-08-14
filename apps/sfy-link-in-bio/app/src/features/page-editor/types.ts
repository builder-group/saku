import {
	TAboutNodeMixin,
	TAppearanceStyleMixin,
	TAssetHash,
	TBaseNode,
	TFillStyleMixin,
	TIdMixin,
	TLayoutStyleMixin,
	TLinkNodeMixin,
	TMediaNodeMixin,
	TMixin,
	TPageLayoutStyleMixin,
	TPageNodeMixin,
	TProductNodeMixin,
	TReference,
	TRgba,
	TShadowStyleMixin,
	TSite,
	TStrokeStyleMixin,
	TTextNodeMixin,
	TTypographyStyleMixin,
	TUnreference
} from '@repo/editor';

export interface TResolvedSite extends Omit<TSite, 'root' | 'assets' | 'integrations'> {
	root: TResolvedPageNode;
}

export type TResolvedNode =
	| TResolvedPageNode
	| TResolvedAboutNode
	| TResolvedLinkNode
	| TResolvedMediaNode
	| TResolvedTextNode
	| TResolvedProductNode
	| TResolvedPromisedNode<TResolvedNode>;

// =========================================================================
// Resolved Nodes
// =========================================================================

export type TResolvedPageNode = TBaseNode<
	TResolvedPageNodeMixin,
	[
		TIdMixin,
		TResolvedChildrenMixin,
		TPageLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin
	]
>;

export type TResolvedAboutNode = TBaseNode<
	TResolvedAboutNodeMixin,
	[
		TIdMixin,
		TResolvedLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedTypographyStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin
	]
>;

export type TResolvedLinkNode = TBaseNode<
	TResolvedLinkNodeMixin,
	[
		TIdMixin,
		TResolvedLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedTypographyStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin
	]
>;

export type TResolvedMediaNode = TBaseNode<
	TResolvedMediaNodeMixin,
	[
		TIdMixin,
		TResolvedLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin
	]
>;

export type TResolvedTextNode = TBaseNode<
	TResolvedTextNodeMixin,
	[
		TIdMixin,
		TResolvedLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedTypographyStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin
	]
>;

export type TResolvedProductNode = TBaseNode<
	TResolvedProductNodeMixin,
	[
		TIdMixin,
		TResolvedLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedTypographyStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin
	]
>;

export interface TResolvedPromisedNode<GNode extends TResolvedNode> {
	type: 'promised';
	cached: GNode;
	next: Promise<GNode>;
}

// =========================================================================
// Resolved Node Mixins
// =========================================================================

export type TResolvedPageNodeMixin = TResolveAll<TPageNodeMixin>;

export type TResolvedAboutNodeMixin = TResolveAll<TAboutNodeMixin>;

export type TResolvedLinkNodeMixin = TResolveAll<TLinkNodeMixin>;

export type TResolvedMediaNodeMixin = TResolveAll<TMediaNodeMixin>;

export type TResolvedTextNodeMixin = TResolveAll<TTextNodeMixin>;

export type TResolvedProductNodeMixin = TResolveAll<TProductNodeMixin>;

// =========================================================================
// Resolved Style Mixins
// =========================================================================

export type TResolvedChildrenMixin = TMixin<'children', TResolvedNode[]>;

export type TResolvedLayoutStyleMixin = TResolveAll<TLayoutStyleMixin>;

export type TResolvedAppearanceStyleMixin = TResolveAll<TAppearanceStyleMixin>;

export type TResolvedTypographyStyleMixin = TResolveAll<TTypographyStyleMixin>;

export type TResolvedFillStyleMixin = TResolveAll<TFillStyleMixin>;

export type TResolvedStrokeStyleMixin = TResolveAll<TStrokeStyleMixin>;

export type TResolvedShadowStyleMixin = TResolveAll<TShadowStyleMixin>;

// =========================================================================
// Helper
// =========================================================================

/**
 * Recursively resolves all TReference types, colors (TRgba to string), and assets (TAsset to string) in an object.
 * This creates fully resolved types where:
 * - TReference types are resolved using TUnreference
 * - Colors become CSS color strings
 * - Assets become their resolved URLs/strings
 * - Objects are recursively processed
 */
export type TResolveAll<T> =
	T extends TReference<any>
		? TUnreference<T>
		: T extends TRgba
			? string
			: T extends TAssetHash
				? { url: string }
				: T extends object
					? { [K in keyof T]: TResolveAll<T[K]> }
					: T;
