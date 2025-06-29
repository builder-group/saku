import { notEmpty } from '@blgc/utils';
import { useCompute, useFeatureState } from 'feature-react';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../lib';
import { TPageNode } from '../../../types';
import { Node } from '../Node';

export const PageNode = React.forwardRef<HTMLDivElement, TPageNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;
	const node = useFeatureState(nodeState);

	const childNodes = useCompute(
		nodeState,
		(node) => {
			return node.children.map((nodeId) => editor.nodeMap[nodeId]).filter(notEmpty);
		},
		[editor]
	);

	return (
		<div
			{...divProps}
			ref={ref}
			className="min-h-screen w-full"
			style={{ backgroundColor: node.style.backgroundColor }}
		>
			<div className="mx-auto w-full max-w-md">
				<div
					className="flex w-full flex-col p-6"
					style={{
						gap: node.style.children?.spacing,
						fontFamily: node.style.children?.fontFamily,
						fontSize: node.style.children?.fontSize,
						color: node.style.children?.textColor
					}}
				>
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
			</div>
		</div>
	);
});
PageNode.displayName = 'PageNode';

interface TPageNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TPageNode>;
	editor: TPageEditor;
}
