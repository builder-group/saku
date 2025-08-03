import { TTextNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext, resolveTextNode } from '../../../lib';
import { TResolvedTextNode } from '../../../types';
import { StaticTextNode } from './static';
import { TNodeProps } from './types';

export const TextNode = React.forwardRef<HTMLDivElement, TNodeProps<TTextNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([{ value: pageNodeValue }, { value: nodeValue }]): TResolvedTextNode => {
			return resolveTextNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				resolved: {
					parentStyles: pageNodeValue?.style.children
				}
			});
		}
	);

	return <StaticTextNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
TextNode.displayName = 'TextNode';
