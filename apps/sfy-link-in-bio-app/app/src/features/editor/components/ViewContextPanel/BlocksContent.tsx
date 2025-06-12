import { Icon, Text } from '@shopify/polaris';
import React from 'react';
import { LayoutSectionIcon } from '@/components';

export const BlocksContent: React.FC = () => {
	return (
		<div className="flex h-full flex-col p-6 text-left">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
				<Icon source={LayoutSectionIcon} />
			</div>
			<div className="mb-2">
				<Text variant="headingMd" as="h3">
					Customize your Link In Bio
				</Text>
			</div>
			<Text variant="bodyMd" tone="subdued" as="p">
				Select a block in the sidebar to start.
			</Text>
		</div>
	);
};
