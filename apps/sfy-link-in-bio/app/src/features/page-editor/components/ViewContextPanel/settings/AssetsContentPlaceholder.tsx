import { Icon, Text } from '@shopify/polaris';
import React from 'react';
import { ImageIcon } from '@/components';

export const AssetsContentPlaceholder: React.FC = () => {
	return (
		<div className="flex h-full flex-col p-6 text-left">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
				<Icon source={ImageIcon} />
			</div>
			<div className="mb-2">
				<Text variant="headingMd" as="h3">
					No assets found
				</Text>
			</div>
			<Text variant="bodyMd" tone="subdued" as="p">
				Assets like fonts and images will appear here when you add them to your page.
			</Text>
		</div>
	);
};
