import { notEmpty } from '@blgc/utils';
import {
	closestCenter,
	DndContext,
	PointerActivationConstraint,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TNodeId } from '@repo/editor';
import { useCompute, useListener } from 'feature-react/state';
import React, { Ref } from 'react';
import { PanelImperativeHandle, usePanelRef } from 'react-resizable-panels';
import { ResizableHandle, ResizablePanel } from '@/components';
import { mq, useMediaQuery } from '@/hooks';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { MobileNavPanel } from '../nav-panel';
import { AddLayerButton } from './AddLayerButton';
import { LayerItem } from './LayerItem';
import { PageItem } from './PageItem';
import { PanelHeader } from './PanelHeader';
import { WatermarkItem } from './WatermarkItem';

export const LayersPanel: React.FC<TLayersPanelProps> = (props) => {
	const { editor, withResizableHandle = false } = props;

	const isMd = useEditorBreakpoint(editor, 'md');
	const isTouchDevice = useMediaQuery(mq.touch);

	const { nodes, nodeIds } = useCompute(editor.getRootNode(), ({ value }) => {
		return {
			nodes: value.children.map((nodeId) => editor.nodeMap[nodeId]).filter(notEmpty),
			nodeIds: value.children
		};
	});
	const watermarkVisible = useCompute(editor.getRootNode(), ({ value }) => {
		return value.watermarkVisible;
	});
	const panelRef = usePanelRef();

	// https://docs.dndkit.com/presets/sortable
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: isTouchDevice
				? ({ delay: 200 } as PointerActivationConstraint)
				: ({
						distance: 8
					} as PointerActivationConstraint)
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
				const toPercent = (pixels: number) => `${(pixels / width) * 100}%`;
				return {
					collapsedSize: undefined,
					minSize: toPercent(150),
					defaultSize: toPercent(225),
					maxSize: toPercent(300)
				};
			}

			// Mobile (vertical layout): Resizable based on height
			const height = rect.bottom - rect.top - MobileNavPanel.height;
			const toPercent = (pixels: number) => `${(pixels / height) * 100}%`;
			return {
				collapsedSize: toPercent(47),
				minSize: toPercent(120),
				defaultSize: toPercent(225),
				maxSize: toPercent(600)
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

	const handleDragStart = React.useCallback(() => {
		editor.isDraggingLayer.set(true);
	}, [editor]);

	const handleDragEnd = React.useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			editor.isDraggingLayer.set(false);

			if (over != null && active.id !== over.id) {
				editor.reorderNode(active.id as TNodeId, over.id as TNodeId);
				if (!isTouchDevice) {
					editor.selectNode(active.id as TNodeId);
				}
			}
		},
		[editor, isTouchDevice]
	);

	// =========================================================================
	// Effects
	// =========================================================================

	useListener(
		editor.selectedNodeId,
		({ value }) => {
			if (isMd) {
				return;
			}

			// TODO: Make programmatic panel collapse/expand work reliably, the setTimeout workaround seems to work for now
			// https://github.com/bvaughn/react-resizable-panels/issues/515#issuecomment-3285269376
			const panel = panelRef.current;
			if (value != null) {
				setTimeout(() => {
					panel?.collapse();
				});
			} else {
				setTimeout(() => {
					panel?.expand();
				});
			}
		},
		[isMd]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{withResizableHandle && <ResizableHandle className="bg-neutral-200" withHandle={!isMd} />}
			<ResizablePanel
				panelRef={panelRef as Ref<PanelImperativeHandle>}
				id="layers-panel"
				collapsible={sizes.collapsedSize != null}
				collapsedSize={sizes.collapsedSize}
				minSize={sizes.minSize}
				defaultSize={sizes.defaultSize}
				maxSize={sizes.maxSize}
			>
				<div className="flex h-full flex-col bg-white">
					<PanelHeader editor={editor} />
					<div className="flex-1 space-y-2 overflow-auto py-2">
						<div className="px-2">
							<PageItem editor={editor} />
						</div>
						<div className="h-px bg-neutral-200" />
						<div className="flex flex-col gap-2 px-2">
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
								onDragStart={handleDragStart}
								modifiers={[restrictToParentElement]}
							>
								<SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
									{nodes.map((nodeState) => (
										<LayerItem key={nodeState._v.id} nodeState={nodeState} editor={editor} />
									))}
								</SortableContext>
							</DndContext>
							{watermarkVisible && <WatermarkItem editor={editor} />}
						</div>
						<div className="px-2">
							<AddLayerButton editor={editor} />
						</div>
					</div>
				</div>
			</ResizablePanel>
		</>
	);
};

interface TLayersPanelProps {
	editor: TPageEditor;
	withResizableHandle?: boolean;
}
