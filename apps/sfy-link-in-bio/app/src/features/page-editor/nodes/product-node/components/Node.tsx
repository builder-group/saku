import { TProductNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { logger } from '@/environment';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolveProductNode } from '../resolve-node';
import { ResolvedProductNode } from './ResolvedNode';

export const ProductNode = React.forwardRef<HTMLDivElement, TNodeProps<TProductNode>>(
	(props, ref) => {
		const { nodeState, editor, ...divProps } = props;

		const node = useCombinedCompute(
			[editor.getRootNode(), nodeState],
			([{ value: pageNodeValue }, { value: nodeValue }]) => {
				const result = resolveProductNode(nodeValue, {
					site: new EditorSiteResolveContext(editor),
					childMixins: pageNodeValue?.childMixins
				});
				if (result.isErr()) {
					editor.shopify.toast.show('Failed to resolve product node');
					logger.warn('Failed to resolve product node', {
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

		return <ResolvedProductNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
	}
);
ProductNode.displayName = 'ProductNode';
