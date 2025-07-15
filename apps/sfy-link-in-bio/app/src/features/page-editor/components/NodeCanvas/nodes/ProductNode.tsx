import { TProductNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveProductNode } from '../../../lib';
import { StaticProductNode, StaticPromisedNode } from './static';
import { TNodeProps } from './types';

export const ProductNode = React.forwardRef<HTMLDivElement, TNodeProps<TProductNode>>(
	(props, ref) => {
		const { nodeState, editor, ...divProps } = props;

		const node = useCombinedCompute(
			[editor.getRootNode(), nodeState],
			([pageNodeValue, nodeValue]) => {
				return resolveProductNode(nodeValue, {
					assetsMap: editor.assetsMap,
					defaultStyles: pageNodeValue?.style.children,
					shopId: editor.shopId
				});
			}
		);

		return node.type === 'promised' ? (
			<StaticPromisedNode {...divProps} ref={ref} node={node} />
		) : (
			<StaticProductNode {...divProps} ref={ref} node={node} />
		);
	}
);
ProductNode.displayName = 'ProductNode';
