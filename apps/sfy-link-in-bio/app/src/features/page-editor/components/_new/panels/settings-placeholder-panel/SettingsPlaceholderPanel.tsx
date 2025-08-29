import { Icon, Text } from '@shopify/polaris';
import React from 'react';
import { PaintBrushFlatIcon, ResizablePanel } from '@/components';

export const SettingsPlaceholderPanel: React.FC<TSettingsPlaceholderPanelProps> = (props) => {
	const { order } = props;

	return (
		<ResizablePanel id="canvas-panel" order={order} className="relative">
			<div className="flex h-full flex-col p-6 text-left">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
					<Icon source={PaintBrushFlatIcon} />
				</div>
				<div className="mb-2">
					<Text variant="headingMd" as="h3">
						Customize the appearance of your Link In Bio
					</Text>
				</div>
				<Text variant="bodyMd" tone="subdued" as="p">
					Theme settings control the colors, typography and other common elements of your Link In
					Bio.
				</Text>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsPlaceholderPanelProps {
	order: number;
}
