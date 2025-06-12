import { TabProps, Tabs } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { TEditor } from '../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { BlocksContentAnalyticsTab } from './BlocksContentAnalyticsTab';
import { BlocksContentCustomizeTab } from './BlocksContentCustomizeTab';
import { BlocksContentPlaceholder } from './BlocksContentPlaceholder';

export const BlocksContent: React.FC<TBlocksContentProps> = (props) => {
	const { editor } = props;

	const selectedBlock = useCompute(
		editor.selectedBlockId,
		(selectedBlockId) => {
			if (selectedBlockId == null) {
				return null;
			}
			return editor.blockMap[selectedBlockId];
		},
		[editor]
	);

	const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

	const handleTabChange = React.useCallback((selectedTabIndex: number) => {
		setSelectedTabIndex(selectedTabIndex);
	}, []);

	if (selectedBlock == null) {
		return <BlocksContentPlaceholder />;
	}

	return (
		<div className="h-full">
			<PanelHeader>
				<Tabs tabs={blocksContentTabs} selected={selectedTabIndex} onSelect={handleTabChange} />
			</PanelHeader>
			<div className="h-full">
				{selectedTabIndex === 0 && (
					<BlocksContentCustomizeTab blockState={selectedBlock} editor={editor} />
				)}
				{selectedTabIndex === 1 && (
					<BlocksContentAnalyticsTab blockState={selectedBlock} editor={editor} />
				)}
			</div>
		</div>
	);
};

const blocksContentTabs = [
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

interface TBlocksContentProps {
	editor: TEditor;
}
