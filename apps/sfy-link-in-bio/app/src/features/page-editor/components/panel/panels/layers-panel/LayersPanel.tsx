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
import { Icon, Text, Tooltip } from '@shopify/polaris';
import { useCompute, useListener } from 'feature-react/state';
import React from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { PolarisDeleteIcon, ResizableHandle, ResizablePanel, StampIcon } from '@/components';
import { mq, useCurrentPlan, useMediaQuery } from '@/hooks';
import { cn } from '@/lib';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { MobileNavPanel } from '../nav-panel';
import { AddLayerButton } from './AddLayerButton';
import { LayerItem } from './LayerItem';
import { PanelHeader } from './PanelHeader';

export const LayersPanel: React.FC<TLayersPanelProps> = (props) => {
	const { editor, order, withResizableHandle = false } = props;

	const isMd = useEditorBreakpoint(editor, 'md');
	const isTouchDevice = useMediaQuery(mq.touch);

	const [collapsed, setCollapsed] = React.useState(false);
	const { nodes, nodeIds } = useCompute(editor.getRootNode(), ({ value }) => {
		return {
			nodes: value.children.map((nodeId) => editor.nodeMap[nodeId]).filter(notEmpty),
			nodeIds: value.children
		};
	});
	const hasWatermark = useCompute(editor.getRootNode(), ({ value }) => {
		return value.hasWatermark;
	});
	const currentPlan = useCurrentPlan();
	const panelRef = React.useRef<ImperativePanelHandle>(null);

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
				const toPercent = (pixels: number) => (pixels / width) * 100;
				return {
					collapsedSize: undefined,
					minSize: toPercent(150),
					defaultSize: toPercent(225),
					maxSize: toPercent(300)
				};
			}

			// Mobile (vertical layout): Resizable based on height
			const height = rect.bottom - rect.top - MobileNavPanel.height;
			const toPercent = (pixels: number) => (pixels / height) * 100;
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

	const handleRemoveWatermark = React.useCallback(() => {
		const rootNode = editor.getRootNode();
		rootNode._v.hasWatermark = false;
		rootNode._notify();
	}, [editor]);

	// =========================================================================
	// Effects
	// =========================================================================

	useListener(
		editor.selectedNodeId,
		({ value }) => {
			if (isMd) {
				return;
			}

			// TODO: Programmatic collapse/expand doesn't work rn
			// https://github.com/bvaughn/react-resizable-panels/issues/515#issuecomment-3285269376
			const panel = panelRef.current;
			if (value != null) {
				panel?.collapse();
			} else {
				panel?.expand();
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
				ref={panelRef}
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
									{hasWatermark && (
										<div className="group flex h-8 w-full items-center gap-2 rounded-lg px-2 opacity-60 hover:bg-neutral-50">
											<StampIcon className="h-5 w-5" />
											<Text as="p" variant="bodyMd">
												Watermark
											</Text>
											<div className="ml-auto flex gap-1">
												{currentPlan.key === 'awesome' ? (
													<button
														className="cursor-pointer rounded-lg p-0.5 hover:bg-neutral-200 hover:text-red-500"
														onClick={handleRemoveWatermark}
													>
														<Icon source={PolarisDeleteIcon} />
													</button>
												) : (
													<Tooltip
														content="Watermark removal is only available on Awesome plan and above"
														width="wide"
														preferredPosition="below"
													>
														<button
															className="cursor-not-allowed rounded-lg p-0.5 opacity-50"
															disabled
															type="button"
														>
															<Icon source={PolarisDeleteIcon} />
														</button>
													</Tooltip>
												)}
											</div>
										</div>
									)}
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
