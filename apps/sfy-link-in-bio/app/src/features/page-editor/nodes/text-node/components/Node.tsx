import { TTextNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { logger } from '@/environment';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolveTextNode } from '../resolve-node';
import { ResolvedTextNode } from './ResolvedNode';

export const TextNode = React.forwardRef<HTMLDivElement, TNodeProps<TTextNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([{ value: pageNodeValue }, { value: nodeValue }]) => {
			const result = resolveTextNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				childMixins: pageNodeValue?.childMixins
			});
			if (result.isErr()) {
				editor.shopify.toast.show('Failed to resolve text node');
				logger.warn('Failed to resolve text node', {
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

	return <ResolvedTextNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
TextNode.displayName = 'TextNode';
