import { Icon, Text } from '@shopify/polaris';
import React from 'react';
import { PolarisPaintBrushFlatIcon, ResizablePanel } from '@/components';

export const SettingsPlaceholderPanel: React.FC<TSettingsPlaceholderPanelProps> = () => {
	return (
		<ResizablePanel id="canvas-panel" className="relative">
			<div className="flex h-full flex-col p-6 text-left">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
					<Icon source={PolarisPaintBrushFlatIcon} />
				</div>
				<div className="mb-2">
					<Text variant="headingMd" as="h3">
						Configure your Link In Bio settings
					</Text>
				</div>
				<Text variant="bodyMd" tone="subdued" as="p">
					Manage metadata, design themes, assets, integrations, and other settings to customize your
					Link In Bio experience.
				</Text>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsPlaceholderPanelProps {}
