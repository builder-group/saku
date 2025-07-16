import { TMediaNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext, resolveMediaNode } from '../../../lib';
import { StaticMediaNode } from './static';
import { TNodeProps } from './types';

export const MediaNode = React.forwardRef<HTMLDivElement, TNodeProps<TMediaNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]) => {
			return resolveMediaNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				resolved: {
					parentStyles: pageNodeValue?.style.children
				}
			});
		}
	);

	return <StaticMediaNode {...divProps} ref={ref} node={node} />;
});
MediaNode.displayName = 'MediaNode';
