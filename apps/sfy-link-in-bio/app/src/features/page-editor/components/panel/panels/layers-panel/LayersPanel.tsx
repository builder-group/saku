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
import { TNodeId } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { ResizableHandle, ResizablePanel, StampIcon } from '@/components';
import { cn } from '@/lib';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { AddLayerButton } from './AddLayerButton';
import { LayerItem } from './LayerItem';
import { PanelHeader } from './PanelHeader';

export const LayersPanel: React.FC<TLayersPanelProps> = (props) => {
	const { editor, order, withResizableHandle = false } = props;

	const isMd = useEditorBreakpoint(editor, 'md');
	const [collapsed, setCollapsed] = React.useState(false);
	const { nodes, nodeIds } = useCompute(editor.getRootNode(), ({ value }) => {
		return {
			nodes: value.children.map((nodeId) => editor.nodeMap[nodeId]).filter(notEmpty),
			nodeIds: value.children
		};
	});
	const hasSelectedNode = useCompute(editor.selectedNodeId, ({ value }) => value != null);

	// https://docs.dndkit.com/presets/sortable
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8 // Require 8px movement before drag starts
			}
		})
	);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			// Desktop (horizontal layout): Resizable based on width
			if (isMd) {
				const width = rect.right - rect.left;
				const toPercent = (pixels: number) => (pixels / (width > 0 ? width : 15)) * 100;
				return {
					collapsedSize: undefined,
					minSize: toPercent(150), // ~ 10
					defaultSize: toPercent(225), // ~ 15
					maxSize: toPercent(300) // ~ 20
				};
			}

			// Mobile (vertical layout): Fixed height for navbar with icons
			const height = rect.bottom - rect.top;
			const toPercent = (pixels: number) => (pixels / (height > 0 ? height : 15)) * 100;
			return {
				collapsedSize: toPercent(45), // ~ 3
				minSize: toPercent(120), // ~ 8
				defaultSize: toPercent(225), // ~ 15
				maxSize: toPercent(600) // ~ 40
			};
		},
		[isMd],
		{
			isEqual(a, b) {
				return (
					a.collapsedSize === b.collapsedSize &&
					a.minSize === b.minSize &&
					a.defaultSize === b.defaultSize &&
					a.maxSize === b.maxSize
				);
			}
		}
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
				editor.reorderNode(active.id as TNodeId, over.id as TNodeId);
				editor.selectNode(active.id as TNodeId);
			}
		},
		[editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	// Hide panel if node is selected and on mobile
	if (hasSelectedNode && !isMd) {
		return null;
	}

	return (
		<>
			{withResizableHandle && <ResizableHandle className="bg-neutral-200" withHandle={!isMd} />}
			<ResizablePanel
				id="layers-panel"
				order={order}
				collapsible={sizes.collapsedSize != null}
				collapsedSize={sizes.collapsedSize}
				minSize={sizes.minSize}
				defaultSize={sizes.defaultSize}
				maxSize={sizes.maxSize}
				onCollapse={() => setCollapsed(true)}
				onExpand={() => setCollapsed(false)}
			>
				<div className="flex h-full flex-col bg-white">
					<PanelHeader editor={editor} />
					<div className={cn('flex-1 overflow-auto', collapsed ? 'p-0' : 'p-2')}>
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
							onDragStart={handleDragStart}
							modifiers={[restrictToParentElement]}
						>
							<SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
								<div className="flex flex-col gap-2">
									{nodes.map((nodeState) => (
										<LayerItem key={nodeState._v.id} nodeState={nodeState} editor={editor} />
									))}
									{/* Watermark item */}
									<div className="flex h-8 w-full items-center gap-2 rounded-lg px-2 opacity-60">
										<StampIcon className="h-5 w-5" />
										<Text as="p" variant="bodyMd">
											Watermark
										</Text>
									</div>
								</div>
							</SortableContext>
						</DndContext>

						<AddLayerButton editor={editor} />
					</div>
				</div>
			</ResizablePanel>
		</>
	);
};

interface TLayersPanelProps {
	editor: TPageEditor;
	order: number;
	withResizableHandle?: boolean;
}
