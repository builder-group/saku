import { notEmpty } from '@blgc/utils';
import { TFlatPageNode } from '@repo/editor';
import { useCombinedCompute, useCompute } from 'feature-react';
import React from 'react';
import { logger } from '@/environment';
import { Node } from '../../../components';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolvePageNodeWithoutChildren } from '../lib/resolve-node';
import { PageWrapper } from './PageWrapper';

export const PageNode = React.forwardRef<HTMLDivElement, TNodeProps<TFlatPageNode>>(
	(props, ref) => {
		const { nodeState, editor, ...divProps } = props;

		const node = useCombinedCompute([nodeState, editor.tokenMap], ([{ value: nodeValue }]) => {
			const result = resolvePageNodeWithoutChildren(nodeValue, {
				site: new EditorSiteResolveContext(editor)
			});
			if (result.isErr()) {
				logger.warn('Failed to resolve page node', {
					error: result.error
				});
				editor.shopify.toast.show('Failed to resolve page node');
				return null;
			}
			return result.value;
		});

		const childNodes = useCompute(
			nodeState,
			({ value: node }) => {
				return node.children.map((nodeId) => editor.nodeMap[nodeId]).filter(notEmpty);
			},
			[editor]
		);

		if (node == null) {
			return null;
		}

		return (
			<PageWrapper ref={ref} node={node} {...divProps}>
				{childNodes.map((childNodeState) => (
					<Node key={childNodeState._v.id} nodeState={childNodeState} editor={editor} />
				))}
			</PageWrapper>
		);
	}
);
PageNode.displayName = 'PageNode';
