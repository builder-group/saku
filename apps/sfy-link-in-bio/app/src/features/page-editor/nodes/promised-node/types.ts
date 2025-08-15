import { TBaseNode, TIdMixin, TMixin } from '@repo/editor';
import { TResolvedNode } from '../../types';

export type TResolvedPromisedNode<GNode extends TResolvedNode = TResolvedNode> = TBaseNode<
	TResolvedPromisedNodeMixin<GNode>,
	[TIdMixin]
>;

export type TResolvedPromisedNodeMixin<GNode extends TResolvedNode = TResolvedNode> = TMixin<
	'node',
	{
		type: 'promised';
		cached: GNode;
		next: Promise<GNode>;
	}
>;
