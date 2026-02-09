import { Icon, Text } from '@shopify/polaris';
import React from 'react';
import { PolarisImageIcon } from '@/components';

export const Placeholder: React.FC = () => {
	return (
		<div className="flex h-full flex-col p-6 text-left">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
				<Icon source={PolarisImageIcon} />
			</div>
			<div className="mb-2">
				<Text variant="headingMd" as="h3">
					No fonts or images yet
				</Text>
			</div>
			<Text variant="bodyMd" tone="subdued" as="p">
				Fonts and images will appear here when you use them in your Design settings or add them to
				layers on your page.
			</Text>
		</div>
	);
};
