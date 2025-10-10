import { TBaseMixin, TIdMixin, TNodeComposition } from '@repo/editor';
import { TResolvedNode } from '../../types';

export type TResolvedPromisedNode<GNode extends TResolvedNode> =
	TResolvedDefaultPromisedNodeComposition<GNode>;

export type TResolvedDefaultPromisedNodeComposition<GNode extends TResolvedNode> = TNodeComposition<
	'default',
	[TIdMixin, TResolvedPromisedNodeMixin<GNode>]
>;

export type TResolvedPromisedNodeMixin<GNode extends TResolvedNode> = TBaseMixin<
	'node',
	{
		type: 'promised';
		cached: GNode;
		next: Promise<GNode>;
	}
>;
