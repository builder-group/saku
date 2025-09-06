import { Icon, Text } from '@shopify/polaris';
import React from 'react';
import { PolarisPaintBrushFlatIcon } from '@/components';

export const ThemePlaceholder: React.FC = () => {
	return (
		<div className="flex h-full flex-col p-6 text-left">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
				<Icon source={PolarisPaintBrushFlatIcon} />
			</div>
			<div className="mb-2">
				<Text variant="headingMd" as="h3">
					Select a theme to customize
				</Text>
			</div>
			<Text variant="bodyMd" tone="subdued" as="p">
				Choose a theme from the Theme tab to start customizing colors, typography, and spacing for
				your Link In Bio.
			</Text>
		</div>
	);
};
