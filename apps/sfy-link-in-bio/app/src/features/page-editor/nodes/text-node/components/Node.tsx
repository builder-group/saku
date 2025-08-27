import { TTextNode } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolveTextNode } from '../resolve-node';
import { ResolvedTextNode } from './ResolvedNode';

export const TextNode = React.forwardRef<HTMLDivElement, TNodeProps<TTextNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCompute(nodeState, ({ value }) => {
		const result = resolveTextNode(value, {
			site: new EditorSiteResolveContext(editor)
		});
		if (result.isErr()) {
			editor.shopify.toast.show('Failed to resolve text node');
			return null;
		}
		return result.value;
	});

	if (node == null) {
		return null;
	}

	return <ResolvedTextNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
TextNode.displayName = 'TextNode';
