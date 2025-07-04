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
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { PlusCircleIcon, PlusIcon } from '@/components';
import { cn } from '@/lib';
import { TPageEditor } from '../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { LayerItem } from './LayerItem';
import { LayerSelectorPopover } from './LayerSelectorPopover';

export const LayersContent: React.FC<TLayersContentProps> = ({ editor }) => {
	const rootNode = React.useMemo(() => editor.getRootNode(), [editor]);
	const nodes = useCompute(rootNode, (rootNode) => {
		return rootNode.children.map((nodeId) => editor.nodeMap[nodeId]).filter(notEmpty);
	});
	const isDragging = useFeatureState(editor.isDraggingLayer);

	// https://docs.dndkit.com/presets/sortable
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

	const handleDragStart = React.useCallback(
		(_: DragStartEvent) => {
			editor.isDraggingLayer.set(true);
		},
		[editor]
	);

	const handleDragEnd = React.useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			editor.isDraggingLayer.set(false);

			if (over != null && active.id !== over.id) {
				editor.reorderNode(active.id as string, over.id as string);
				editor.selectNode(active.id as string);
			}
		},
		[editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="flex h-full flex-col">
			<PanelHeader className="flex flex-row items-center justify-between">
				<Text as="h2" variant="headingMd">
					Layers
				</Text>
				<LayerSelectorPopover
					editor={editor}
					activator={
						<div className="flex items-center justify-center">
							<Button icon={PlusIcon} disabled={isDragging} variant="plain" />
						</div>
					}
					width="auto"
				/>
			</PanelHeader>
			<div className="flex-1 overflow-auto p-2">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
					onDragStart={handleDragStart}
					modifiers={[restrictToParentElement]}
				>
					<SortableContext items={rootNode._v.children} strategy={verticalListSortingStrategy}>
						<div className="flex flex-col gap-2">
							{nodes.map((nodeState) => (
								<LayerItem key={nodeState._v.id} nodeState={nodeState} editor={editor} />
							))}
						</div>
					</SortableContext>
				</DndContext>

				<LayerSelectorPopover
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
								Add layer
							</Text>
						</div>
					}
					width="activator"
				/>
			</div>
		</div>
	);
};

interface TLayersContentProps {
	editor: TPageEditor;
}
