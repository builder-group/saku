import { notEmpty } from '@blgc/utils';
import { TFlatPageNode } from '@repo/editor';
import { useCombinedCompute, useCompute } from 'feature-react';
import React from 'react';
import { LogoIcon } from '@/components';
import { logger } from '@/environment';
import { Node } from '../../../components';
import { useTokenSetNotifier } from '../../../hooks';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolvePageNodeWithoutChildren } from '../resolve-node';

export const PageNode = React.forwardRef<HTMLDivElement, TNodeProps<TFlatPageNode>>(
	(props, ref) => {
		const { nodeState, editor, ...divProps } = props;

		const tokenSetNotifier = useTokenSetNotifier(editor, ['autoLayout', 'appearance', 'fill']);

		const node = useCombinedCompute([nodeState, tokenSetNotifier], ([{ value: nodeValue }]) => {
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

		const { content, autoLayout, appearance, fill } = node;

		return (
			<>
				<div
					{...divProps}
					ref={ref}
					className="relative min-h-screen w-full overflow-x-hidden"
					style={{
						...appearance.styles,
						...fill?.styles
					}}
				>
					<div className="mx-auto w-full max-w-md">
						<div className="flex w-full flex-col" style={autoLayout.styles}>
							{childNodes.map((childNodeState) => (
								<Node key={childNodeState._v.id} nodeState={childNodeState} editor={editor} />
							))}
						</div>
					</div>
				</div>

				{/* Watermark */}
				{content.hasWatermark && (
					<div className="sticky bottom-0 w-full">
						<a
							href="https://saku.so"
							target="_blank"
							rel="noopener noreferrer"
							className="absolute right-4 bottom-4 z-[999] flex items-center gap-1 rounded-lg bg-white px-2 py-[6px] text-sm text-black no-underline shadow-[0_0_0_1px_rgba(20,24,31,0.025),0_2px_8px_rgba(20,24,31,0.1)] hover:opacity-75"
						>
							<LogoIcon className="h-6 w-6" />
							<span>Made in Saku</span>
						</a>
					</div>
				)}
			</>
		);
	}
);
PageNode.displayName = 'PageNode';
