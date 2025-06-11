import { Text } from '@shopify/polaris';
import React from 'react';
import { PanelHeader } from '../PanelHeader';

export const SettingsContent: React.FC = () => {
	return (
		<>
			<PanelHeader>
				<Text as="h2" variant="headingMd">
					Settings
				</Text>
			</PanelHeader>
			<div>Settings Content</div>
		</>
	);
};
