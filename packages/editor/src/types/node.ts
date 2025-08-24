import { TId } from '../lib';
import {
	TAboutNodeMixin,
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TChildrenMixin,
	TCtaStyleMixin,
	TFillStyleMixin,
	TFlatChildrenMixin,
	TIdMixin,
	TLinkNodeMixin,
	TMediaNodeMixin,
	TMergeMixins,
	TMixin,
	TPageNodeMixin,
	TProductNodeMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextNodeMixin,
	TTextStyleMixin
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
	[TIdMixin, TChildrenMixin, TAutoLayoutStyleMixin, TAppearanceStyleMixin, TFillStyleMixin]
>;

export type TFlatPageNode = TBaseNode<
	TPageNodeMixin,
	[TIdMixin, TFlatChildrenMixin, TAutoLayoutStyleMixin, TAppearanceStyleMixin, TFillStyleMixin]
>;

export type TAboutNode = TBaseNode<
	TAboutNodeMixin,
	[
		TIdMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextStyleMixin
	]
>;

export type TLinkNode<GVariant extends TLinkVariant = TLinkVariant> = TBaseNode<
	TLinkNodeMixin<GVariant>,
	[
		TIdMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextStyleMixin
	]
>;

export type TMediaNode<GMedia extends TMedia = TMedia> = TBaseNode<
	TMediaNodeMixin<GMedia>,
	[
		TIdMixin,
		TAutoLayoutStyleMixin,
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
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextStyleMixin
	]
>;

export type TProductNode = TBaseNode<
	TProductNodeMixin,
	[
		TIdMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextStyleMixin,
		TCtaStyleMixin
	]
>;
