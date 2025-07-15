import { TLinkNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveLinkNode } from '../../../lib';
import { StaticLinkNode, StaticPromisedNode } from './static';
import { TNodeProps } from './types';

export const LinkNode = React.forwardRef<HTMLDivElement, TNodeProps<TLinkNode>>((props, ref) => {
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
