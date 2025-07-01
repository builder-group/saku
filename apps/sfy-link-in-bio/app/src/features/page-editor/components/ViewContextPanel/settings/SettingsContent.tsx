import { Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { TPageEditor } from '../../../lib';
import { PageNodeEditor } from '../../NodeEditor';
import { PanelHeader } from '../../PanelHeader';
import { SettingsContentPlaceholder } from './SettingsContentPlaceholder';

export const SettingsContent: React.FC<TSettingsContentProps> = (props) => {
	const { editor } = props;

	const selectedSection = useFeatureState(editor.activeSettingsSection);

	switch (selectedSection) {
		case 'appearance':
			return (
				<div className="flex h-full flex-col">
					<PanelHeader>
						<Text as="h2" variant="headingMd">
							Appearance
						</Text>
					</PanelHeader>
					<div className="flex-1 overflow-auto">
						<PageNodeEditor nodeState={editor.getRootNode()} editor={editor} />
					</div>
				</div>
			);
		default:
			return <SettingsContentPlaceholder />;
	}
};

interface TSettingsContentProps {
	editor: TPageEditor;
}
