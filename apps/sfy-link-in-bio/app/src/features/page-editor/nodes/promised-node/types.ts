import { TBaseMixin, TIdMixin, TNodeBundle } from '@repo/editor';
import { TResolvedNode } from '../../types';

export type TResolvedPromisedNode<GNode extends TResolvedNode> =
	TResolvedDefaultPromisedNodeBundle<GNode>;

export type TResolvedDefaultPromisedNodeBundle<GNode extends TResolvedNode> = TNodeBundle<
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
