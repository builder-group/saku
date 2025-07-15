import { TNode } from '@repo/editor';
import { TNodeState, TPageEditor } from '../../../lib';
import { TResolvedNode } from '../../../types';

export interface TStaticNodeProps<GResolvedNode extends TResolvedNode>
	extends React.HTMLProps<HTMLDivElement> {
	node: GResolvedNode;
	state?: 'loading' | 'error' | 'success';
}

export interface TNodeProps<GNode extends TNode> extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<GNode>;
	editor: TPageEditor;
}
