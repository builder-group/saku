import { TNode } from '@repo/editor';
import { useCombinedCompute, useCompute, useFeatureState } from 'feature-react';
import React from 'react';
import { cn } from '@/lib';
import { nodeMetadataMap } from '../../environment';
import { TNodeState, TPageEditor } from '../../lib';

export const NodeIndicators: React.FC<TNodeIndicatorsProps> = (props) => {
	const { editor } = props;

	const rootNode = useFeatureState(editor.getRootNode());

	return (
		<>
			{rootNode.children.map((nodeId) => {
				const nodeState = editor.nodeMap[nodeId];
				if (nodeState == null) {
					return null;
				}

				// Skip internal nodes
				if (nodeMetadataMap[nodeState._v.type].internal) {
					return null;
				}

				return <NodeIndicator key={`indicator-${nodeId}`} nodeState={nodeState} editor={editor} />;
			})}
		</>
	);
};

interface TNodeIndicatorsProps {
	editor: TPageEditor;
}

export const NodeIndicator: React.FC<TNodeIndicatorProps> = (props) => {
	const { nodeState, editor } = props;
	const nodeId = useCompute(nodeState, (node) => node.id);

	const isSelected = useCompute(editor.selectedNodeId, (selectedId) => selectedId === nodeId, [
		nodeId
	]);

	const position = useCombinedCompute(
		[nodeState.boundingRect, editor.canvasBoundingRect],
		([boundingRect, canvasRect]) => {
			// Skip if node has no dimensions
			if (boundingRect.right === 0 && boundingRect.bottom === 0) {
				return null;
			}

			return {
				top: boundingRect.top - canvasRect.top,
				height: boundingRect.bottom - boundingRect.top
			};
		}
	);

	if (position == null) {
		return null;
	}

	return (
		<div
			className="group absolute z-10 w-[calc(100%-4px)] cursor-pointer"
			style={{
				left: '4px',
				top: `${position.top}px`,
				height: `${position.height}px`
			}}
			onClick={() => editor.selectNode(nodeId)}
		>
			{/* Gradient background */}
			<div
				className={cn(
					'pointer-events-none absolute top-0 left-0 w-full rounded-lg',
					isSelected &&
						'bg-gradient-to-r from-[#005BD3]/15 via-[#005BD3]/5 to-transparent opacity-100',
					!isSelected &&
						'bg-gradient-to-r from-neutral-900/[0.03] via-neutral-900/[0.01] to-transparent opacity-0 group-hover:opacity-100'
				)}
				style={{
					height: `${position.height}px`
				}}
			/>

			{/* Indicator bar */}
			<div
				className={cn(
					'pointer-events-none absolute top-0 left-0 w-1 rounded-sm',
					isSelected && 'bg-[#005BD3] opacity-100',
					!isSelected &&
						'bg-neutral-300 opacity-30 group-hover:bg-neutral-500 group-hover:opacity-70'
				)}
				style={{
					height: `${position.height}px`
				}}
			/>
		</div>
	);
};

interface TNodeIndicatorProps {
	nodeState: TNodeState<TNode>;
	editor: TPageEditor;
}
