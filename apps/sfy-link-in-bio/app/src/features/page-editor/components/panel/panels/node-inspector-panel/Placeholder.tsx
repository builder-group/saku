import { Icon, Text } from '@shopify/polaris';
import React from 'react';
import { PolarisLayoutSectionIcon } from '@/components';

export const Placeholder: React.FC = () => {
	return (
		<div className="flex h-full flex-col bg-white p-6 text-left">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
				<Icon source={PolarisLayoutSectionIcon} />
			</div>
			<div className="mb-2">
				<Text variant="headingMd" as="h3">
					Customize your Link In Bio
				</Text>
			</div>
			<Text variant="bodyMd" tone="subdued" as="p">
				Select a layer (link, heading, image, etc.) in the Layers panel to edit it.
			</Text>
		</div>
	);
};
