import { TabProps, Tabs } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { TPageEditor } from '../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { LayersContentAnalyticsTab } from './LayersContentAnalyticsTab';
import { LayersContentCustomizeTab } from './LayersContentCustomizeTab';
import { LayersContentPlaceholder } from './LayersContentPlaceholder';

export const LayersContent: React.FC<TLayersContentProps> = (props) => {
	const { editor } = props;

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

	const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

	const handleTabChange = React.useCallback((selectedTabIndex: number) => {
		setSelectedTabIndex(selectedTabIndex);
	}, []);

	if (selectedNode == null) {
		return <LayersContentPlaceholder />;
	}

	return (
		<div className="flex h-full flex-col">
			<PanelHeader>
				{/* Offset 8px Tab padding which can't be removed */}
				<div className="-ml-2">
					<Tabs tabs={layersContentTabs} selected={selectedTabIndex} onSelect={handleTabChange} />
				</div>
			</PanelHeader>
			<div className="flex-1 overflow-auto">
				{selectedTabIndex === 0 && (
					<LayersContentCustomizeTab nodeState={selectedNode} editor={editor} />
				)}
				{selectedTabIndex === 1 && (
					<LayersContentAnalyticsTab nodeState={selectedNode} editor={editor} />
				)}
			</div>
		</div>
	);
};

const layersContentTabs = [
	{
		id: 'customize',
		content: 'Customize',
		panelID: 'customize-panel'
	},
	{
		id: 'analytics',
		content: 'Analytics',
		panelID: 'analytics-panel'
	}
] satisfies TabProps[];

interface TLayersContentProps {
	editor: TPageEditor;
}
