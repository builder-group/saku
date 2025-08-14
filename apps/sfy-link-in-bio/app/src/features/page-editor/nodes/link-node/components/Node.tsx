import { TLinkNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolveLinkNode } from '../resolve-node';
import { ResolvedLinkNode } from './ResolvedNode';

export const LinkNode = React.forwardRef<HTMLDivElement, TNodeProps<TLinkNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([{ value: pageNodeValue }, { value: nodeValue }]) => {
			return resolveLinkNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				resolved: {
					childDefaults: pageNodeValue?.style.children
				}
			});
		}
	);

	return <ResolvedLinkNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
LinkNode.displayName = 'LinkNode';
