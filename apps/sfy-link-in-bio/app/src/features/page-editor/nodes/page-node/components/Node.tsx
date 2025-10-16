import { notEmpty } from '@blgc/utils';
import { TFlatPageNode } from '@repo/editor';
import { useCombinedCompute, useCompute } from 'feature-react';
import React from 'react';
import { LogoIcon } from '@/components';
import { logger } from '@/environment';
import { Node } from '../../../components';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolvePageNodeWithoutChildren } from '../resolve-node';

export const PageNode = React.forwardRef<HTMLDivElement, TNodeProps<TFlatPageNode>>(
	(props, ref) => {
		const { nodeState, editor, ...divProps } = props;

		const { contentRadius, glassBorderRadius, borderWidth } = React.useMemo(() => {
			const contentRadius = 8; // px
			const borderWidth = 5; // px
			return {
				contentRadius,
				glassBorderRadius: contentRadius + borderWidth,
				borderWidth
			};
		}, []);

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

		const { hasWatermark, autoLayout, appearance, fill } = node;

		return (
			<>
				<div
					{...divProps}
					ref={ref}
					className="relative min-h-screen w-full overflow-x-hidden"
					style={{
						...appearance.styles,
						...fill?.styles,
						['--content-radius' as string]: `${contentRadius}px`,
						['--glass-border-radius' as string]: `${glassBorderRadius}px`,
						['--glass-border-width' as string]: `${borderWidth}px`
					}}
				>
					<div className="absolute inset-0 hidden bg-black/10 backdrop-blur-xl sm:block" />

					<div className="relative mx-auto w-full max-w-xl sm:pt-10">
						<div className="relative">
							<div
								className="overflow-hidden rounded-t-none pb-16 sm:rounded-t-[var(--content-radius)] sm:shadow-[0_24px_32px_0px_rgba(0,0,0,0.15)]"
								style={{
									...appearance.styles,
									...fill?.styles
								}}
							>
								<div className="flex w-full flex-col" style={autoLayout.styles}>
									{childNodes.map((childNodeState) => (
										<Node key={childNodeState._v.id} nodeState={childNodeState} editor={editor} />
									))}
								</div>
							</div>

							<div className="pointer-events-none absolute top-0 left-0 -mt-[var(--glass-border-width)] -ml-[var(--glass-border-width)] hidden h-full w-[calc(100%+var(--glass-border-width)*2)] rounded-t-none border-t-[length:var(--glass-border-width)] border-r-[length:var(--glass-border-width)] border-l-[length:var(--glass-border-width)] border-solid border-[#ffffff52] sm:block sm:rounded-t-[var(--glass-border-radius)]" />
						</div>
					</div>
				</div>

				{hasWatermark && (
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
