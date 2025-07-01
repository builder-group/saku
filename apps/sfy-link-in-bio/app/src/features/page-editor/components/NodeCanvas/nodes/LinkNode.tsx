import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveLinkNode, TNodeState, TPageEditor } from '../../../lib';
import { TLinkNode, TResolvedLinkNode } from '../../../types';
import { StaticLinkNode } from './static';

export const LinkNode = React.forwardRef<HTMLDivElement, TLinkNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]): TResolvedLinkNode => {
			return resolveLinkNode(nodeValue, editor.assetsMap, pageNodeValue?.style.children);
		}
	);

	return <StaticLinkNode {...divProps} ref={ref} node={node} />;
});
LinkNode.displayName = 'LinkNode';

interface TLinkNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TLinkNode>;
	editor: TPageEditor;
}
