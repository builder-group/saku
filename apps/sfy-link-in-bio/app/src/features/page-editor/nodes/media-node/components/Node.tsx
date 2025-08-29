import { TMediaNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { logger } from '@/environment';
import { useTokenSetNotifier } from '../../../hooks';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolveMediaNode } from '../resolve-node';
import { ResolvedMediaNode } from './ResolvedNode';

export const MediaNode = React.forwardRef<HTMLDivElement, TNodeProps<TMediaNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const tokenSetNotifier = useTokenSetNotifier(editor, [
		'autoLayout',
		'appearance',
		'fill',
		'stroke',
		'shadow'
	]);

	const node = useCombinedCompute([nodeState, tokenSetNotifier], ([{ value }]) => {
		const result = resolveMediaNode(value, {
			site: new EditorSiteResolveContext(editor)
		});
		if (result.isErr()) {
			logger.warn('Failed to resolve media node', {
				error: result.error
			});
			editor.shopify.toast.show('Failed to resolve media node');
			return null;
		}
		return result.value;
	});

	if (node == null) {
		return null;
	}

	return <ResolvedMediaNode {...divProps} ref={ref} node={node} cx={editor.pageContext} />;
});
MediaNode.displayName = 'MediaNode';
