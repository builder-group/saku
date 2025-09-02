import { TId } from '../lib';
import {
	TAboutNodeContent,
	TAboutNodeMixin,
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TBaseMixin,
	TButtonStyleMixin,
	TChildrenMixin,
	TFillStyleMixin,
	TFlatChildrenMixin,
	TIdMixin,
	TLinkNodeContent,
	TLinkNodeMixin,
	TMediaNodeContent,
	TMediaNodeMixin,
	TMergeMixins,
	TPageNodeContent,
	TPageNodeMixin,
	TProductNodeContent,
	TProductNodeMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextNodeContent,
	TTextNodeMixin,
	TTextStyleMixin
} from './mixin';

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
	GNodeMixin extends TBaseMixin<'node', any>,
	GOtherMixins extends TBaseMixin<any, any>[]
> = GNodeMixin['value'] & TMergeMixins<GOtherMixins>;

// =========================================================================
// Nodes
// =========================================================================

export type TPageNode<GContent extends TPageNodeContent = TPageNodeContent> = TBaseNode<
	TPageNodeMixin<GContent>,
	[TIdMixin, TChildrenMixin, TAutoLayoutStyleMixin, TAppearanceStyleMixin, TFillStyleMixin]
>;

export type TFlatPageNode<GContent extends TPageNodeContent = TPageNodeContent> = TBaseNode<
	TPageNodeMixin<GContent>,
	[TIdMixin, TFlatChildrenMixin, TAutoLayoutStyleMixin, TAppearanceStyleMixin, TFillStyleMixin]
>;

export type TAboutNode<GVariant extends TAboutNodeContent = TAboutNodeContent> = TBaseNode<
	TAboutNodeMixin<GVariant>,
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

export type TLinkNode<GContent extends TLinkNodeContent = TLinkNodeContent> = TBaseNode<
	TLinkNodeMixin<GContent>,
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

export type TMediaNode<GContent extends TMediaNodeContent = TMediaNodeContent> = TBaseNode<
	TMediaNodeMixin<GContent>,
	[
		TIdMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin
	]
>;

export type TTextNode<GContent extends TTextNodeContent = TTextNodeContent> = TBaseNode<
	TTextNodeMixin<GContent>,
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

export type TProductNode<GContent extends TProductNodeContent = TProductNodeContent> = TBaseNode<
	TProductNodeMixin<GContent>,
	[
		TIdMixin,
		TAutoLayoutStyleMixin,
		TAppearanceStyleMixin,
		TFillStyleMixin,
		TStrokeStyleMixin,
		TShadowStyleMixin,
		TTextStyleMixin,
		TButtonStyleMixin
	]
>;
