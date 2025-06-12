import { notEmpty } from '@blgc/utils';
import {
	closestCenter,
	DndContext,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, Icon, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { PlusCircleIcon, PlusIcon } from '@/components';
import { cn } from '@/lib';
import { TEditor } from '../../lib';
import { PanelHeader } from '../PanelHeader';
import { BlockItem } from './BlockItem';
import { BlockSelectorPopover } from './BlockSelectorPopover';

export const BlocksContent: React.FC<TBlocksContentProps> = ({ editor }) => {
	const blocks = useCompute(editor.blockIds, (blocks) => {
		return blocks.map((blockId) => editor.blockMap[blockId]).filter(notEmpty);
	});

	// https://docs.dndkit.com/presets/sortable
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8 // Require 8px movement before drag starts
			}
		})
	);
	const [isDragging, setIsDragging] = React.useState(false);

	// =========================================================================
	// Events
	// =========================================================================

	const handleDragStart = React.useCallback((_: DragStartEvent) => {
		setIsDragging(true);
	}, []);

	const handleDragEnd = React.useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			setIsDragging(false);

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
			<PanelHeader className="flex flex-row items-center justify-between">
				<Text as="h2" variant="headingMd">
					Blocks
				</Text>
				<BlockSelectorPopover
					editor={editor}
					activator={<Button icon={PlusIcon} disabled={isDragging} variant="plain" />}
					width="auto"
				/>
			</PanelHeader>
			<div className="p-2">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
					onDragStart={handleDragStart}
					modifiers={[restrictToParentElement]}
				>
					<SortableContext items={editor.blockIds._v} strategy={verticalListSortingStrategy}>
						<div className="flex flex-col gap-2">
							{blocks.map((blockState) => (
								<BlockItem key={blockState._v.id} blockState={blockState} editor={editor} />
							))}
						</div>
					</SortableContext>
				</DndContext>

				<BlockSelectorPopover
					editor={editor}
					activator={
						<div
							className={cn(
								'mt-2 flex h-[34px] items-center gap-2 rounded-lg px-2 text-[#005BD3]',
								isDragging && 'opacity-50',
								!isDragging && 'cursor-pointer hover:bg-gray-50'
							)}
						>
							<div>
								<Icon source={PlusCircleIcon} />
							</div>
							<Text as="p" variant="bodyMd">
								Add block
							</Text>
						</div>
					}
					width="activator"
				/>
			</div>
		</>
	);
};

interface TBlocksContentProps {
	editor: TEditor;
}
