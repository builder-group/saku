import { TProductNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolveProductNode } from '../resolve-node';
import { ResolvedProductNode } from './ResolvedNode';

export const ProductNode = React.forwardRef<HTMLDivElement, TNodeProps<TProductNode>>(
	(props, ref) => {
		const { nodeState, editor, ...divProps } = props;

		const node = useCombinedCompute(
			[editor.getRootNode(), nodeState],
			([{ value: pageNodeValue }, { value: nodeValue }]) => {
				return resolveProductNode(nodeValue, {
					site: new EditorSiteResolveContext(editor),
					childMixins: pageNodeValue?.childMixins
				});
			}
		);

		return <ResolvedProductNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
	}
);
ProductNode.displayName = 'ProductNode';
