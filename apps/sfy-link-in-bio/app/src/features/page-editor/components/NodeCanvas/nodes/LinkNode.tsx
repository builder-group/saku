import { TLinkNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext, resolveLinkNode } from '../../../lib';
import { StaticLinkNode } from './static';
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

	return <StaticLinkNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
LinkNode.displayName = 'LinkNode';
