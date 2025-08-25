import { TabProps, Tabs } from '@shopify/polaris';
import React from 'react';
import { TPageEditor } from '../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { DesignContentCustomizeTab } from './DesignContentCustomizeTab';
import { DesignContentTemplateTab } from './DesignContentTemplateTab';

export const DesignContent: React.FC<TDesignContentProps> = (props) => {
	const { editor } = props;

	const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

	const handleTabChange = React.useCallback((selectedTabIndex: number) => {
		setSelectedTabIndex(selectedTabIndex);
	}, []);

	return (
		<div className="flex h-full flex-col">
			<PanelHeader>
				{/* Offset 8px Tab padding which can't be removed */}
				<div className="-ml-2">
					<Tabs tabs={designTabs} selected={selectedTabIndex} onSelect={handleTabChange} />
				</div>
			</PanelHeader>
			<div className="flex-1 overflow-auto">
				{selectedTabIndex === 0 && <DesignContentTemplateTab editor={editor} />}
				{selectedTabIndex === 1 && <DesignContentCustomizeTab editor={editor} />}
			</div>
		</div>
	);
};

interface TDesignContentProps {
	editor: TPageEditor;
}

const designTabs = [
	{
		id: 'template',
		content: 'Template',
		panelID: 'template-panel'
	},
	{
		id: 'customize',
		content: 'Customize',
		panelID: 'customize-panel'
	}
] satisfies TabProps[];
