import { Icon, Text } from '@shopify/polaris';
import React from 'react';
import { PolarisAlertTriangleIcon } from '@/components';

export const ThemeUnavailable: React.FC = () => {
	return (
		<div className="flex h-full flex-col p-6 text-left">
			<div className="bg-warning-100 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
				<Icon source={PolarisAlertTriangleIcon} />
			</div>
			<div className="mb-2">
				<Text variant="headingMd" as="h3">
					Theme failed to load
				</Text>
			</div>
			<Text variant="bodyMd" tone="subdued" as="p">
				Unable to load the theme for customization. Please try selecting a different theme.
			</Text>
		</div>
	);
};
