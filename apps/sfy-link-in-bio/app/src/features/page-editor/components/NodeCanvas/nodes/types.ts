import { TFlatNode } from '@repo/editor';
import { TNodeState, TPageContext, TPageEditor } from '../../../lib';
import { TResolvedNode } from '../../../types';

export interface TStaticNodeProps<GResolvedNode extends TResolvedNode>
	extends React.HTMLProps<HTMLDivElement> {
	cx: TPageContext;
	node: GResolvedNode;
	state?: 'loading' | 'error' | 'success';
}

export interface TNodeProps<GNode extends TFlatNode> extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<GNode>;
	editor: TPageEditor;
}
