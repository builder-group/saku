import { TAboutNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteProvider, resolveAboutNode } from '../../../lib';
import { StaticAboutNode } from './static';
import { TNodeProps } from './types';

export const AboutNode = React.forwardRef<HTMLDivElement, TNodeProps<TAboutNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]) => {
			return resolveAboutNode(nodeValue, {
				site: new EditorSiteProvider(editor),
				resolved: {
					parentStyles: pageNodeValue?.style.children
				}
			});
		}
	);

	return <StaticAboutNode {...divProps} ref={ref} node={node} />;
});
AboutNode.displayName = 'AboutNode';
