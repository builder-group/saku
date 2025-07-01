import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveTextNode, TNodeState, TPageEditor } from '../../../lib';
import { TResolvedTextNode, TTextNode } from '../../../types';
import { StaticTextNode } from './static';

export const TextNode = React.forwardRef<HTMLDivElement, TTextNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]): TResolvedTextNode => {
			return resolveTextNode(nodeValue, pageNodeValue?.style.children);
		}
	);

	return <StaticTextNode {...divProps} ref={ref} node={node} />;
});
TextNode.displayName = 'TextNode';

interface TTextNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TTextNode>;
	editor: TPageEditor;
}
