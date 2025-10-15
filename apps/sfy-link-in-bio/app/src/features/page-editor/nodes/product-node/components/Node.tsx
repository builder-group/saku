import { TProductNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { logger } from '@/environment';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolveProductNode } from '../lib';
import { ResolvedProductNode } from './ResolvedNode';

export const ProductNode = React.forwardRef<HTMLDivElement, TNodeProps<TProductNode>>(
	(props, ref) => {
		const { nodeState, editor, ...divProps } = props;

		const node = useCombinedCompute([nodeState, editor.tokenMap], ([{ value }]) => {
			const result = resolveProductNode(value, {
				site: new EditorSiteResolveContext(editor)
			});
			if (result.isErr()) {
				logger.warn('Failed to resolve product node', {
					error: result.error
				});
				editor.shopify.toast.show('Failed to resolve product node');
				return null;
			}
			return result.value;
		});

		if (node == null) {
			return null;
		}

		return <ResolvedProductNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
	}
);
ProductNode.displayName = 'ProductNode';
