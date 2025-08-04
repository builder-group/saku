import { TLinkNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext } from '../../../../../lib';
import { TNodeProps } from '../../../types';
import { resolveLinkNode } from '../resolve-link-node';
import { ResolvedLinkNode } from './ResolvedLinkNode';

export const LinkNode = React.forwardRef<HTMLDivElement, TNodeProps<TLinkNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([{ value: pageNodeValue }, { value: nodeValue }]) => {
			return resolveLinkNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				resolved: {
					parentStyles: pageNodeValue?.style.children
				}
			});
		}
	);

	return <ResolvedLinkNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
LinkNode.displayName = 'LinkNode';
