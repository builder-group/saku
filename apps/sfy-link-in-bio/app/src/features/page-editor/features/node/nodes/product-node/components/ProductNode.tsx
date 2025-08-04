import { TProductNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext } from '../../../../../lib';
import { TNodeProps } from '../../../types';
import { resolveProductNode } from '../resolve-product-node';
import { ResolvedProductNode } from './ResolvedProductNode';

export const ProductNode = React.forwardRef<HTMLDivElement, TNodeProps<TProductNode>>(
	(props, ref) => {
		const { nodeState, editor, ...divProps } = props;

		const node = useCombinedCompute(
			[editor.getRootNode(), nodeState],
			([{ value: pageNodeValue }, { value: nodeValue }]) => {
				return resolveProductNode(nodeValue, {
					site: new EditorSiteResolveContext(editor),
					resolved: {
						parentStyles: pageNodeValue?.style.children
					}
				});
			}
		);

		return <ResolvedProductNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
	}
);
ProductNode.displayName = 'ProductNode';
