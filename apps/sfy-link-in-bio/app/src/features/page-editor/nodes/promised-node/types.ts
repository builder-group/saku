import { TBaseNode, TIdMixin, TMixin } from '@repo/editor';
import { TResolvedNode } from '../../types';

export type TResolvedPromisedNode<GNode extends TResolvedNode> = TBaseNode<
	TResolvedPromisedNodeMixin<GNode>,
	[TIdMixin]
>;

export type TResolvedPromisedNodeMixin<GNode extends TResolvedNode> = TMixin<
	'node',
	{
		type: 'promised';
		cached: GNode;
		next: Promise<GNode>;
	}
>;
