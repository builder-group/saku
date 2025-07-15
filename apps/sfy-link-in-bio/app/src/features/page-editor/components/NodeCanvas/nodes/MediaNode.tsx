import { TMediaNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveMediaNode } from '../../../lib';
import { StaticMediaNode } from './static';
import { TNodeProps } from './types';

export const MediaNode = React.forwardRef<HTMLDivElement, TNodeProps<TMediaNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]) => {
			return resolveMediaNode(nodeValue, {
				assetsMap: editor.assetsMap,
				defaultStyles: pageNodeValue?.style.children,
				shopId: editor.shopId
			});
		}
	);

	return <StaticMediaNode {...divProps} ref={ref} node={node} />;
});
MediaNode.displayName = 'MediaNode';
