import { Text } from '@shopify/polaris';
import React from 'react';
import { TPageEditor } from '../../../lib';
import { PageNodeEditor } from '../../NodeEditor/editors';
import { PanelHeader } from '../../PanelHeader';

export const SettingsContent: React.FC<TSettingsContentProps> = (props) => {
	const { editor } = props;

	return (
		<>
			<PanelHeader>
				<Text as="h2" variant="headingMd">
					Settings
				</Text>
			</PanelHeader>
			<PageNodeEditor nodeState={editor.getRootNode()} editor={editor} />
		</>
	);
};

interface TSettingsContentProps {
	editor: TPageEditor;
}
