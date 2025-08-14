import { TAboutNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolveAboutNode } from '../resolve-node';
import { ResolvedAboutNode } from './ResolvedNode';

export const AboutNode = React.forwardRef<HTMLDivElement, TNodeProps<TAboutNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([{ value: pageNodeValue }, { value: nodeValue }]) => {
			return resolveAboutNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				resolved: {
					childDefaults: pageNodeValue?.style.children
				}
			});
		}
	);

	return <ResolvedAboutNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
AboutNode.displayName = 'AboutNode';
