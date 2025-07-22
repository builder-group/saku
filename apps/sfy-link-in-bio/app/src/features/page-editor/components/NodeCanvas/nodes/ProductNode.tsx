import { TProductNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext, resolveProductNode } from '../../../lib';
import { StaticProductNode } from './static';
import { TNodeProps } from './types';

export const ProductNode = React.forwardRef<HTMLDivElement, TNodeProps<TProductNode>>(
	(props, ref) => {
		const { nodeState, editor, ...divProps } = props;

		const node = useCombinedCompute(
			[editor.getRootNode(), nodeState],
			([pageNodeValue, nodeValue]) => {
				return resolveProductNode(nodeValue, {
					site: new EditorSiteResolveContext(editor),
					resolved: {
						parentStyles: pageNodeValue?.style.children
					}
				});
			}
		);

		return <StaticProductNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
	}
);
ProductNode.displayName = 'ProductNode';
