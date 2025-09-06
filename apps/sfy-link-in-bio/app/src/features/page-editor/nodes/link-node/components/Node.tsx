import { TLinkNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { logger } from '@/environment';
import { useTokenSetNotifier } from '../../../hooks';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolveLinkNode } from '../resolve-node';
import { ResolvedLinkNode } from './ResolvedNode';

export const LinkNode = React.forwardRef<HTMLDivElement, TNodeProps<TLinkNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const tokenSetNotifier = useTokenSetNotifier(editor, [
		'autoLayout',
		'appearance',
		'fill',
		'stroke',
		'shadow',
		'text',
		'image'
	]);

	const node = useCombinedCompute([nodeState, tokenSetNotifier], ([{ value }]) => {
		const result = resolveLinkNode(value, {
			site: new EditorSiteResolveContext(editor)
		});
		if (result.isErr()) {
			logger.warn('Failed to resolve link node', {
				error: result.error
			});
			editor.shopify.toast.show('Failed to resolve link node');
			return null;
		}
		return result.value;
	});

	if (node == null) {
		return null;
	}

	return <ResolvedLinkNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
LinkNode.displayName = 'LinkNode';
