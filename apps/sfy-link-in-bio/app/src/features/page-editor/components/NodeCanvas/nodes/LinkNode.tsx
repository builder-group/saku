import { TLinkNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext, resolveLinkNode } from '../../../lib';
import { StaticLinkNode, StaticPromisedNode } from './static';
import { TNodeProps } from './types';

export const LinkNode = React.forwardRef<HTMLDivElement, TNodeProps<TLinkNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]) => {
			return resolveLinkNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				resolved: {
					parentStyles: pageNodeValue?.style.children
				}
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
