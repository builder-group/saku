import { TLinkNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveLinkNode, TNodeState, TPageEditor } from '../../../lib';
import { StaticLinkNode, StaticPromisedNode } from './static';

export const LinkNode = React.forwardRef<HTMLDivElement, TLinkNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]) => {
			return resolveLinkNode(nodeValue, {
				assetsMap: editor.assetsMap,
				defaultStyles: pageNodeValue?.style.children,
				shopId: editor.shopId
			});
		}
	);

	return node.type === 'promised' ? (
		<StaticPromisedNode {...divProps} ref={ref} node={node} />
	) : (
		<StaticLinkNode {...divProps} ref={ref} node={node} />
	);
});
LinkNode.displayName = 'LinkNode';

interface TLinkNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TLinkNode>;
	editor: TPageEditor;
}
