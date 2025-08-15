import { TLinkNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { logger } from '@/environment';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolveLinkNode } from '../resolve-node';
import { ResolvedLinkNode } from './ResolvedNode';

export const LinkNode = React.forwardRef<HTMLDivElement, TNodeProps<TLinkNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([{ value: pageNodeValue }, { value: nodeValue }]) => {
			const result = resolveLinkNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				childMixins: pageNodeValue?.childMixins
			});
			if (result.isErr()) {
				editor.shopify.toast.show('Failed to resolve link node');
				logger.warn('Failed to resolve link node', {
					error: result.error
				});
				return null;
			}
			return result.value;
		}
	);

	if (node == null) {
		return null;
	}

	return <ResolvedLinkNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
LinkNode.displayName = 'LinkNode';
