import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveNode, TNodeState, TPageEditor } from '../../../lib';
import { TPageNode, TTextNode, TWithResolvedStyles } from '../../../types';
import { StaticTextNode } from './static';

export const TextNode = React.forwardRef<HTMLDivElement, TTextNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]): TWithResolvedStyles<TTextNode> => {
			return resolveNode(nodeValue, pageNodeValue as unknown as TPageNode);
		}
	);

	return <StaticTextNode {...divProps} ref={ref} node={node} />;
});
TextNode.displayName = 'TextNode';

interface TTextNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TTextNode>;
	editor: TPageEditor;
}
