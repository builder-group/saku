import { TTextNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { TResolvedTextNode } from '../../../types';
import { resolveTextNode } from '../resolve-node';
import { ResolvedTextNode } from './ResolvedNode';

export const TextNode = React.forwardRef<HTMLDivElement, TNodeProps<TTextNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([{ value: pageNodeValue }, { value: nodeValue }]): TResolvedTextNode => {
			return resolveTextNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				resolved: {
					childDefaults: pageNodeValue?.style.children
				}
			});
		}
	);

	return <ResolvedTextNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
TextNode.displayName = 'TextNode';
