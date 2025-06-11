import { useDndContext } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon, Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import React from 'react';
import { DeleteIcon, DragHandleIcon } from '@/components';
import { cn } from '@/lib';
import { blocksMetadataMap, TBlock } from '../../environment';

export const BlockItem: React.FC<TBlockItemProps> = (props) => {
	const { block, onDelete } = props;
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: block._v.id
	});

	const metadata = React.useMemo(() => blocksMetadataMap[block._v.type], [block._v.type]);
	const { active } = useDndContext();
	const isAnyItemDragging = React.useMemo(() => active != null, [active]);

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
						{metadata?.icon && <Icon source={metadata.icon} />}
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
						{metadata?.label}
					</Text>
				</div>
				<div
					className={cn(
						'hidden cursor-pointer rounded-lg p-1 hover:text-red-500',
						!isAnyItemDragging && 'group-hover:block'
					)}
					onClick={() => onDelete(block._v.id)}
				>
					<Icon source={DeleteIcon} />
				</div>
			</div>
		</div>
	);
};

interface TBlockItemProps {
	block: TState<TBlock, []>;
	onDelete: (blockId: string) => void;
}
