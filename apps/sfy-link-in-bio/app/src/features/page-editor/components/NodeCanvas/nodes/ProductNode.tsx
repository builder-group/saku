import { TProductNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveProductNode, TNodeState, TPageEditor } from '../../../lib';
import { StaticPromisedNode } from './static';

export const ProductNode = React.forwardRef<HTMLDivElement, TProductNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]) => {
			return resolveProductNode(nodeValue, {
				assetsMap: editor.assetsMap,
				defaultStyles: pageNodeValue?.style.children
			});
		}
	);

	return <StaticPromisedNode {...divProps} ref={ref} node={node} />;
});
ProductNode.displayName = 'ProductNode';

interface TProductNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TProductNode>;
	editor: TPageEditor;
}
