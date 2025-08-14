import { TId } from '../lib';
import {
	TAboutNodeMixin,
	TChildrenMixin,
	TFlatChildrenMixin,
	TIdMixin,
	TLinkNodeMixin,
	TMediaNodeMixin,
	TMergeMixins,
	TMixin,
	TPageNodeMixin,
	TProductNodeMixin,
	TTextNodeMixin
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
	GNodeMixin extends TMixin<'node', any>,
	GOtherMixins extends TMixin<any, any>[]
> = GNodeMixin['value'] & TMergeMixins<GOtherMixins>;

// =========================================================================
// Nodes
// =========================================================================

export type TPageNode = TBaseNode<TPageNodeMixin, [TIdMixin, TChildrenMixin]>;
export type TFlatPageNode = TBaseNode<TPageNodeMixin, [TIdMixin, TFlatChildrenMixin]>;
export type TAboutNode = TBaseNode<TAboutNodeMixin, [TIdMixin]>;
export type TLinkNode = TBaseNode<TLinkNodeMixin, [TIdMixin]>;
export type TMediaNode = TBaseNode<TMediaNodeMixin, [TIdMixin]>;
export type TTextNode = TBaseNode<TTextNodeMixin, [TIdMixin]>;
export type TProductNode = TBaseNode<TProductNodeMixin, [TIdMixin]>;
