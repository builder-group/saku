import { Button, InlineStack } from '@shopify/polaris';
import React from 'react';
import { ResizablePanel, ViewIcon } from '@/components';
import { TEditor } from '../lib';
import { BlockCanvas } from './BlockCanvas';
import { PanelHeader } from './PanelHeader';

export const CanvasPanel: React.FC<TCanvasPanelProps> = (props) => {
	const { editor } = props;

	const handleSave = React.useCallback(() => {
		// TODO: Persist the editor state
	}, []);

	return (
		<ResizablePanel>
			{/* Fixed Header */}
			<PanelHeader className="h-12 justify-end">
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

			{/* Scrollable content */}
			<div className="h-[calc(100%-3rem)] w-full overflow-y-auto bg-neutral-50">
				<div className="flex min-h-full w-full flex-col p-4">
					<BlockCanvas editor={editor} />
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TCanvasPanelProps {
	editor: TEditor;
}
