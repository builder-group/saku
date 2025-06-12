import { useDndContext } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { DeleteIcon, DragHandleIcon } from '@/components';
import { cn } from '@/lib';
import { blocksMetadataMap, TBlock } from '../../environment';
import { TEditor } from '../../lib';

export const BlockItem: React.FC<TBlockItemProps> = (props) => {
	const { blockState, editor } = props;
	const blockId = useCompute(blockState, (block) => block.id);
	const blockMetadata = useCompute(blockState, (block) => blocksMetadataMap[block.type]);

	// https://docs.dndkit.com/presets/sortable
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: blockId
	});
	const { active } = useDndContext();
	const isAnyItemDragging = React.useMemo(() => active != null, [active]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleDeleteBlock = React.useCallback(() => {
		editor.removeBlock(blockId);
	}, [editor, blockId]);

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
				'group flex h-7 w-full items-center rounded-lg px-2',
				isDragging && 'opacity-50',
				!isAnyItemDragging && 'cursor-pointer hover:bg-gray-50'
			)}
		>
			<div className="flex w-full items-center gap-2">
				<div>
					<div className={cn(isAnyItemDragging ? 'block' : 'group-hover:hidden')}>
						{blockMetadata?.icon && <Icon source={blockMetadata.icon} />}
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
				<div className="grow">
					<Text as="p" variant="bodySm">
						{blockMetadata?.label}
					</Text>
				</div>
				<div
					className={cn(
						'hidden cursor-pointer rounded-lg p-1 hover:text-red-500',
						!isAnyItemDragging && 'group-hover:block'
					)}
					onClick={handleDeleteBlock}
				>
					<Icon source={DeleteIcon} />
				</div>
			</div>
		</div>
	);
};

interface TBlockItemProps {
	editor: TEditor;
	blockState: TState<TBlock, []>;
}
