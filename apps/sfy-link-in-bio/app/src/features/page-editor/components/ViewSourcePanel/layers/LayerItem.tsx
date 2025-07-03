import { useDndContext } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TNode } from '@repo/editor';
import { Icon, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { DeleteIcon, DragHandleIcon } from '@/components';
import { cn } from '@/lib';
import { nodeMetadataMap } from '../../../environment';
import { TFlattenedNode, TPageEditor } from '../../../lib';

export const LayerItem: React.FC<TLayerItemProps> = (props) => {
	const { nodeState, editor } = props;
	const nodeId = useCompute(nodeState, (node) => node.id);
	const nodeMetadata = useCompute(nodeState, (node) => nodeMetadataMap[node.type]);
	const isSelected = useCompute(
		editor.selectedNodeId,
		(selectedNodeId) => selectedNodeId === nodeId
	);

	// https://docs.dndkit.com/presets/sortable
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: nodeId
	});
	const { active } = useDndContext();
	const isAnyItemDragging = React.useMemo(() => active != null, [active]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleDeleteNode = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation(); // Prevent the event from bubbling up to the parent (select event)
			editor.removeNode(nodeId);
		},
		[editor, nodeId]
	);

	const handleSelectNode = React.useCallback(() => {
		editor.selectNode(nodeId);
	}, [editor, nodeId]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition
			}}
			className={cn(
				'group flex h-8 w-full items-center gap-2 rounded-lg px-2',
				isDragging && 'opacity-50',
				!isAnyItemDragging && 'cursor-pointer hover:bg-neutral-50',
				isSelected && 'bg-neutral-100'
			)}
			onClick={handleSelectNode}
		>
			<div>
				<div className={cn('block', !isAnyItemDragging && 'group-hover:hidden')}>
					{nodeMetadata?.icon && <Icon source={nodeMetadata.icon} />}
				</div>
				<div
					{...attributes}
					{...listeners}
					className={cn(
						'hidden cursor-grab active:cursor-grabbing',
						!isAnyItemDragging && 'group-hover:block'
					)}
				>
					<Icon source={DragHandleIcon} />
				</div>
			</div>
			<Text as="p" variant="bodyMd">
				{nodeMetadata?.label}
			</Text>
			<button
				className={cn(
					'ml-auto hidden cursor-pointer rounded-lg p-0.5 hover:bg-neutral-200 hover:text-red-500',
					!isAnyItemDragging && 'group-hover:block'
				)}
				onClick={handleDeleteNode}
			>
				<Icon source={DeleteIcon} />
			</button>
		</div>
	);
};

interface TLayerItemProps {
	editor: TPageEditor;
	nodeState: TState<TFlattenedNode<TNode>, []>;
}
