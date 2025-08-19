import { TId } from '../lib';
import {
	TAboutNodeMixin,
	TAppearanceStyleMixin,
	TChildrenMixin,
	TFillStyleMixin,
	TFlatChildrenMixin,
	TIdMixin,
	TLayoutStyleMixin,
	TLinkNodeMixin,
	TMediaNodeMixin,
	TMergeMixins,
	TMixin,
	TPageLayoutStyleMixin,
	TPageNodeMixin,
	TProductNodeMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextNodeMixin,
	TTypographyStyleMixin
} from './mixin';
import { TLinkVariant, TMedia } from './utils';

export type TNode = TPageNode | TAboutNode | TLinkNode | TMediaNode | TTextNode | TProductNode;
export type TFlatNode =
	| TFlatPageNode
	| TAboutNode
	| TLinkNode
	| TMediaNode
	| TTextNode
	| TProductNode;

export type TNodeId = TId<'node'>;

export type TBaseNode<
	GNodeMixin extends TMixin<'node', any>,
	GOtherMixins extends TMixin<any, any>[]
> = GNodeMixin['value'] & TMergeMixins<GOtherMixins>;

// =========================================================================
// Nodes
// =========================================================================

export type TPageNode = TBaseNode<
	TPageNodeMixin,
	[TIdMixin, TChildrenMixin, TPageLayoutStyleMixin, TAppearanceStyleMixin, TFillStyleMixin]
>;

export type TFlatPageNode = TBaseNode<
	TPageNodeMixin,
	[TIdMixin, TFlatChildrenMixin, TPageLayoutStyleMixin, TAppearanceStyleMixin, TFillStyleMixin]
>;

export type TAboutNode = TBaseNode<
	TAboutNodeMixin,
	[
		TIdMixin,
		TLayoutStyleMixin,
		TAppearanceStyleMixin,
		TTypographyStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin
	]
>;

export type TLinkNode<GVariant extends TLinkVariant = TLinkVariant> = TBaseNode<
	TLinkNodeMixin<GVariant>,
	[
		TIdMixin,
		TLayoutStyleMixin,
		TAppearanceStyleMixin,
		TTypographyStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin
	]
>;

export type TMediaNode<GMedia extends TMedia = TMedia> = TBaseNode<
	TMediaNodeMixin<GMedia>,
	[
		TIdMixin,
		TLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin
	]
>;

export type TTextNode = TBaseNode<
	TTextNodeMixin,
	[
		TIdMixin,
		TLayoutStyleMixin,
		TAppearanceStyleMixin,
		TTypographyStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin
	]
>;

export type TProductNode = TBaseNode<
	TProductNodeMixin,
	[
		TIdMixin,
		TLayoutStyleMixin,
		TAppearanceStyleMixin,
		TTypographyStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin
	]
>;
