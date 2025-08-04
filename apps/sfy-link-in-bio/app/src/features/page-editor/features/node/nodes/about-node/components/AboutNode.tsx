import { TAboutNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext } from '../../../../../lib';
import { TNodeProps } from '../../../types';
import { resolveAboutNode } from '../resolve-about-node';
import { ResolvedAboutNode } from './ResolvedAboutNode';

export const AboutNode = React.forwardRef<HTMLDivElement, TNodeProps<TAboutNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([{ value: pageNodeValue }, { value: nodeValue }]) => {
			return resolveAboutNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				resolved: {
					parentStyles: pageNodeValue?.style.children
				}
			});
		}
	);

	return <ResolvedAboutNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
AboutNode.displayName = 'AboutNode';
