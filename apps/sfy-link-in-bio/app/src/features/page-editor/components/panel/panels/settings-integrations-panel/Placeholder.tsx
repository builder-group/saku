import { Icon, Text } from '@shopify/polaris';
import React from 'react';
import { PolarisAppsIcon } from '@/components';

export const Placeholder: React.FC = () => {
	return (
		<div className="flex h-full flex-col p-6 text-left">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
				<Icon source={PolarisAppsIcon} />
			</div>
			<div className="mb-2">
				<Text variant="headingMd" as="h3">
					No integrations connected
				</Text>
			</div>
			<Text variant="bodyMd" tone="subdued" as="p">
				Connect integrations like Shopify to enable additional features and functionality for your
				page.
			</Text>
		</div>
	);
};
