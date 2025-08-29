import { Tabs } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../../PanelHeader';
import { Placeholder } from './Placeholder';
import { AnalyticsTab, CustomizeTab, tabs } from './tabs';

export const NodeInspectorPanel: React.FC<TNodeInspectorPanelProps> = (props) => {
	const { editor, order } = props;

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
			const width = rect.right - rect.left;
			if (width <= 0) {
				// Note: Return default sizes instead of null to prevent the panel from being hidden on hot reload
				return {
					minSize: 20,
					defaultSize: 25,
					maxSize: 30
				};
			}

			const toPercent = (pixels: number) => (pixels / width) * 100;

			return {
				minSize: toPercent(300), // ~ 20
				defaultSize: toPercent(375), // ~ 25
				maxSize: toPercent(450) // ~ 30
			};
		},
		[],
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

	// =========================================================================
	// UI
	// =========================================================================

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
						{/* Offset 8px Tab padding which can't be removed */}
						<div className="-ml-2">
							<Tabs tabs={tabs} selected={tabIndex} onSelect={handleTabChange} />
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
