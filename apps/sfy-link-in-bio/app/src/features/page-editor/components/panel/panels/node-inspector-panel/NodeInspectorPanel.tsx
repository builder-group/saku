import { Button, Tabs } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { PolarisXIcon, ResizablePanel } from '@/components';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { Placeholder } from './Placeholder';
import { AnalyticsTab, CustomizeTab, tabs } from './tabs';

export const NodeInspectorPanel: React.FC<TNodeInspectorPanelProps> = (props) => {
	const { editor, order } = props;

	const isMd = useEditorBreakpoint(editor, 'md');
	const [tabIndex, setTabIndex] = React.useState(0);
	const selectedNode = useCompute(
		editor.selectedNodeId,
		({ value: selectedNodeId }) => {
			if (selectedNodeId == null) {
				return null;
			}
			return editor.nodeMap[selectedNodeId];
		},
		[editor]
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
					minSize: toPercent(300), // ~ 20
					defaultSize: toPercent(375), // ~ 25
					maxSize: toPercent(450) // ~ 30
				};
			}

			// Mobile (vertical layout): Resizable based on height
			const height = rect.bottom - rect.top;
			const toPercent = (pixels: number) => (pixels / (height > 0 ? height : 15)) * 100;
			return {
				minSize: toPercent(45), // ~ 3
				defaultSize: toPercent(300), // ~ 20
				maxSize: toPercent(450) // ~ 30
			};
		},
		[isMd],
		{
			isEqual(a, b) {
				return (
					a.minSize === b.minSize && a.defaultSize === b.defaultSize && a.maxSize === b.maxSize
				);
			}
		}
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTabChange = React.useCallback((tabIndex: number) => {
		setTabIndex(tabIndex);
	}, []);

	const handleUnselectNode = React.useCallback(() => {
		editor.selectedNodeId.set(null);
	}, [editor]);

	// =========================================================================
	// UI
	// =========================================================================

	// Hide panel if no node is selected and on mobile
	if (selectedNode == null && !isMd) {
		return null;
	}

	return (
		<ResizablePanel
			id="node-inspector-panel"
			order={order}
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
		>
			{selectedNode != null ? (
				<div className="flex h-full flex-col bg-white">
					<PanelHeader>
						<div className="flex w-full items-center justify-between">
							{/* Offset 8px Tab padding which can't be removed */}
							<div className="-ml-2">
								<Tabs tabs={tabs} selected={tabIndex} onSelect={handleTabChange} />
							</div>
							{/* Cross icon for mobile to unselect node */}
							{!isMd && (
								<Button
									icon={PolarisXIcon}
									variant="plain"
									onClick={handleUnselectNode}
									accessibilityLabel="Unselect node"
								/>
							)}
						</div>
					</PanelHeader>
					{/* 96px bottom padding is to avoid blocking content with Live Chat overlay */}
					<div className="flex-1 overflow-auto pb-24">
						{tabIndex === 0 && <CustomizeTab nodeState={selectedNode} editor={editor} />}
						{tabIndex === 1 && <AnalyticsTab nodeState={selectedNode} editor={editor} />}
					</div>
				</div>
			) : (
				<Placeholder />
			)}
		</ResizablePanel>
	);
};

interface TNodeInspectorPanelProps {
	editor: TPageEditor;
	order: number;
}
