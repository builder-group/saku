import { TResolvedNode } from '../../types';

export interface TResolvedPromisedNode<GNode extends TResolvedNode = TResolvedNode> {
	type: 'promised';
	cached: GNode;
	next: Promise<GNode>;
}
