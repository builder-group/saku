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
						Pick a setting from the list to get started
					</Text>
				</div>
				<Text variant="bodyMd" tone="subdued" as="p">
					Design = colors and fonts. Metadata = how your page looks when shared. Assets = fonts and
					images you use.
				</Text>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsPlaceholderPanelProps {}
