import { notEmpty } from '@blgc/utils';
import { useCompute, useFeatureState } from 'feature-react';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../lib';
import { TPageNode } from '../../../types';
import { Node } from '../Node';

export const PageNode = React.forwardRef<HTMLDivElement, TPageNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;
	const node = useFeatureState(nodeState);

	// Get child nodes from the editor's nodeMap
	const childNodes = useCompute(
		nodeState,
		(node) => {
			return node.children.map((nodeId) => editor.nodeMap[nodeId]).filter(notEmpty);
		},
		[editor]
	);

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			{/* Page container with padding and layout */}
			<div className="relative overflow-hidden rounded-3xl bg-white shadow-sm transition-colors">
				{/* Content area with padding */}
				<div className="flex w-full flex-col gap-3 p-6">
					{childNodes.length === 0 ? (
						<div className="flex min-h-[96px] items-center justify-center text-neutral-400">
							Empty page...
						</div>
					) : (
						childNodes.map((childNodeState) => (
							<Node key={childNodeState._v.id} nodeState={childNodeState} editor={editor} />
						))
					)}
				</div>

				{/* Border and highlight effects */}
				<div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/[0.08]" />
				<div className="pointer-events-none absolute inset-[1px] rounded-[23px] ring-1 ring-white/[0.22]" />
			</div>
		</div>
	);
});
PageNode.displayName = 'PageNode';

interface TPageNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TPageNode>;
	editor: TPageEditor;
}
