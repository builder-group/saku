import { useDndContext } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TFlatNode } from '@repo/editor';
import { Icon, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { PolarisDeleteIcon, PolarisDragHandleIcon, PolarisDuplicateIcon } from '@/components';
import { mq, useMediaQuery } from '@/hooks';
import { cn } from '@/lib';
import { nodeMetadataRegistry, TNodeState, TPageEditor } from '../../../../lib';

export const LayerItem: React.FC<TLayerItemProps> = (props) => {
	const { nodeState, editor } = props;
	const nodeId = useCompute(nodeState, ({ value: node }) => node.id);
	const nodeMetadata = useCompute(nodeState, ({ value: node }) => nodeMetadataRegistry[node.type]);
	const isSelected = useCompute(
		editor.selectedNodeId,
		({ value: selectedNodeId }) => selectedNodeId === nodeId
	);

	// https://docs.dndkit.com/presets/sortable
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: nodeId
	});
	const { active } = useDndContext();
	const isAnyItemDragging = React.useMemo(() => active != null, [active]);

	const isTouchDevice = useMediaQuery(mq.touch);

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

	const handleCopyNode = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation(); // Prevent the event from bubbling up to the parent (select event)
			const copiedNodeId = editor.copyNode(nodeId);
			if (copiedNodeId != null) {
				editor.selectNode(copiedNodeId);
			}
		},
		[editor, nodeId]
	);

	const handleSelectNode = React.useCallback(() => {
		editor.selectNode(nodeId);
	}, [editor, nodeId]);

	// =========================================================================
	// UI
	// =========================================================================

	if (nodeMetadata.internal || nodeMetadata.hidden) {
		return null;
	}

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
				isSelected && 'bg-neutral-100',
				// https://docs.dndkit.com/api-documentation/draggable#touch-action
				isTouchDevice && 'touch-none'
			)}
			onClick={handleSelectNode}
			{...(isTouchDevice ? { ...attributes, ...listeners } : {})}
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
					<Icon source={PolarisDragHandleIcon} />
				</div>
			</div>
			<Text as="p" variant="bodyMd">
				{nodeMetadata?.label}
			</Text>
			<div className={cn('ml-auto hidden gap-1', !isAnyItemDragging && 'group-hover:flex')}>
				<button
					className="cursor-pointer rounded-lg p-0.5 hover:bg-neutral-200"
					onClick={handleCopyNode}
				>
					<Icon source={PolarisDuplicateIcon} />
				</button>
				<button
					className="cursor-pointer rounded-lg p-0.5 hover:bg-neutral-200 hover:text-red-500"
					onClick={handleDeleteNode}
				>
					<Icon source={PolarisDeleteIcon} />
				</button>
			</div>
		</div>
	);
};

interface TLayerItemProps {
	editor: TPageEditor;
	nodeState: TNodeState<TFlatNode>;
}
