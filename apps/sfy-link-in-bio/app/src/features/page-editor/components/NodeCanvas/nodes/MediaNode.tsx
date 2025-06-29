import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveNode, TNodeState, TPageEditor } from '../../../lib';
import { TMediaNode, TPageNode, TWithResolvedStyles } from '../../../types';
import { StaticMediaNode } from './static';

export const MediaNode = React.forwardRef<HTMLDivElement, TMediaNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]): TWithResolvedStyles<TMediaNode> => {
			return resolveNode(nodeValue, pageNodeValue as unknown as TPageNode);
		}
	);

	return <StaticMediaNode {...divProps} ref={ref} node={node} />;
});
MediaNode.displayName = 'MediaNode';

interface TMediaNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TMediaNode>;
	editor: TPageEditor;
}
