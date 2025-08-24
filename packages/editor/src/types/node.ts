import { TId } from '../lib';
import {
	TAboutNodeMixin,
	TCardStyleMixin,
	TChildrenMixin,
	TCtaStyleMixin,
	TFlatChildrenMixin,
	TIdMixin,
	TLinkNodeMixin,
	TMediaNodeMixin,
	TMergeMixins,
	TMixin,
	TPageNodeMixin,
	TPageStyleMixin,
	TProductNodeMixin,
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

export type TPageNode = TBaseNode<TPageNodeMixin, [TIdMixin, TChildrenMixin, TPageStyleMixin]>;

export type TFlatPageNode = TBaseNode<
	TPageNodeMixin,
	[TIdMixin, TFlatChildrenMixin, TPageStyleMixin]
>;

export type TAboutNode = TBaseNode<TAboutNodeMixin, [TIdMixin, TCardStyleMixin, TTextStyleMixin]>;

export type TLinkNode<GVariant extends TLinkVariant = TLinkVariant> = TBaseNode<
	TLinkNodeMixin<GVariant>,
	[TIdMixin, TCardStyleMixin, TTextStyleMixin]
>;

export type TMediaNode<GMedia extends TMedia = TMedia> = TBaseNode<
	TMediaNodeMixin<GMedia>,
	[TIdMixin, TCardStyleMixin]
>;

export type TTextNode = TBaseNode<TTextNodeMixin, [TIdMixin, TCardStyleMixin, TTextStyleMixin]>;

export type TProductNode = TBaseNode<
	TProductNodeMixin,
	[TIdMixin, TCardStyleMixin, TTextStyleMixin, TCtaStyleMixin]
>;
