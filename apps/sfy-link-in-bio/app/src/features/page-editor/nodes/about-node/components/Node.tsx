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
			const result = resolveAboutNode(nodeValue, {
				site: new EditorSiteResolveContext(editor),
				childMixins: pageNodeValue?.childMixins
			});
			if (result.isErr()) {
				editor.shopify.toast.show('Failed to resolve about node');
				return null;
			}
			return result.value;
		}
	);

	if (node == null) {
		return null;
	}

	return <ResolvedAboutNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
AboutNode.displayName = 'AboutNode';
