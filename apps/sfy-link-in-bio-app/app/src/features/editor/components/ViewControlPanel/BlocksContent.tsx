import { notEmpty } from '@blgc/utils';
import {
	closestCenter,
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Icon, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { PlusCircleIcon } from '@/components';
import { TEditor } from '../../lib';
import { PanelHeader } from '../PanelHeader';
import { BlockItem } from './BlockItem';

export const BlocksContent: React.FC<TBlocksContentProps> = ({ editor }) => {
	const blocks = useCompute(editor.blocks, (blocks) => {
		return blocks.map((blockId) => editor.blockMap[blockId]).filter(notEmpty);
	});

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8 // Require 8px movement before drag starts
			}
		})
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleDeleteBlock = React.useCallback(
		(blockId: string) => {
			editor.removeBlock(blockId);
		},
		[editor]
	);

	const handleDragEnd = React.useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;

			if (over != null && active.id !== over.id) {
				editor.swapBlocks(active.id as string, over.id as string);
			}
		},
		[editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<PanelHeader>
				<Text as="h2" variant="headingMd">
					Blocks
				</Text>
			</PanelHeader>
			<div className="p-2">
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext
						items={blocks.map((block) => block._v.id) as string[]}
						strategy={verticalListSortingStrategy}
					>
						<div className="flex flex-col gap-2">
							{blocks.map((block) => (
								<BlockItem key={block._v.id} block={block} onDelete={handleDeleteBlock} />
							))}
						</div>
					</SortableContext>
				</DndContext>

				<div className="mt-2 flex h-[34px] cursor-pointer items-center gap-2 rounded-lg px-2 text-[#005BD3] hover:bg-gray-50">
					<div>
						<Icon source={PlusCircleIcon} />
					</div>
					<Text as="p" variant="bodyMd">
						Add block
					</Text>
				</div>
			</div>
		</>
	);
};

interface TBlocksContentProps {
	editor: TEditor;
}
