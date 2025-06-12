import { Button, InlineStack } from '@shopify/polaris';
import React from 'react';
import { ResizablePanel, ViewIcon } from '@/components';
import { PanelHeader } from './PanelHeader';

export const CanvasPanel: React.FC = () => {
	const handleSave = React.useCallback(() => {
		// TODO: Persist the editor state
	}, []);

	return (
		<ResizablePanel>
			<PanelHeader className="justify-end">
				<InlineStack gap="200" blockAlign="center">
					<Button
						icon={ViewIcon}
						variant="secondary"
						url={'todo'}
						external
						target="_blank"
						accessibilityLabel="Visit your Link In Bio page"
					/>
					<Button variant="primary" onClick={handleSave} disabled>
						Save
					</Button>
				</InlineStack>
			</PanelHeader>

			<div className="flex h-full flex-1 items-center justify-center bg-gray-50 p-4">Canvas</div>
		</ResizablePanel>
	);
};
