import { TAboutNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveAboutNode, TNodeState, TPageEditor } from '../../../lib';
import type { TResolvedAboutNode } from '../../../types';
import { StaticAboutNode } from './static';

export const AboutNode = React.forwardRef<HTMLDivElement, TAboutNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]): TResolvedAboutNode => {
			return resolveAboutNode(nodeValue, editor.assetsMap, pageNodeValue?.style.children);
		}
	);

	return <StaticAboutNode {...divProps} ref={ref} node={node} />;
});
AboutNode.displayName = 'AboutNode';

interface TAboutNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TAboutNode>;
	editor: TPageEditor;
}
