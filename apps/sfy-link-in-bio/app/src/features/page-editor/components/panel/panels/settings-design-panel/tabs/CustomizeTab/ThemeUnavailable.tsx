import { Button, Icon, Text } from '@shopify/polaris';
import React from 'react';
import { PolarisAlertTriangleIcon } from '@/components';
import { TPageEditor } from '../../../../../../lib';

export const ThemeUnavailable: React.FC<TThemeUnavailableProps> = (props) => {
	const { editor } = props;

	const handleGoToThemeTab = React.useCallback(() => {
		editor.activeDesignSettingsTab.set(0);
	}, [editor]);

	return (
		<div className="flex h-full flex-col p-6 text-left">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
				<Icon source={PolarisAlertTriangleIcon} />
			</div>
			<div className="mb-2">
				<Text variant="headingMd" as="h3">
					Something went wrong loading this theme
				</Text>
			</div>
			<div className="mb-4">
				<Text variant="bodyMd" tone="subdued" as="p">
					Try choosing a different theme in the Theme tab.
				</Text>
			</div>
			<Button variant="primary" onClick={handleGoToThemeTab}>
				Go to Theme tab
			</Button>
		</div>
	);
};

interface TThemeUnavailableProps {
	editor: TPageEditor;
}
