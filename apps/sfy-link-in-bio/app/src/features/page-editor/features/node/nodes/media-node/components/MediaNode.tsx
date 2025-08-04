import { TMediaNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext } from '../../../../../lib';
import { TNodeProps } from '../../../types';
import { resolveMediaNode } from '../resolve-media-node';
import { ResolvedMediaNode } from './ResolvedMediaNode';

export const MediaNode = React.forwardRef<HTMLDivElement, TNodeProps<TMediaNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([{ value: pageNodeValue }, { value: nodeValue }]) => {
			return resolveMediaNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				resolved: {
					parentStyles: pageNodeValue?.style.children
				}
			});
		}
	);

	return <ResolvedMediaNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
MediaNode.displayName = 'MediaNode';
