import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveNode, TNodeState, TPageEditor } from '../../../lib';
import { TLinkNode, TPageNode, TWithResolvedStyles } from '../../../types';
import { StaticLinkNode } from './static';

export const LinkNode = React.forwardRef<HTMLDivElement, TLinkNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]): TWithResolvedStyles<TLinkNode> => {
			return resolveNode(nodeValue, pageNodeValue as unknown as TPageNode);
		}
	);

	return <StaticLinkNode {...divProps} ref={ref} node={node} />;
});
LinkNode.displayName = 'LinkNode';

interface TLinkNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TLinkNode>;
	editor: TPageEditor;
}
