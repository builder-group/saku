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

			<div className="flex h-full flex-1 bg-gray-50 p-4">
				<BlockCanvas editor={editor} />
			</div>
		</ResizablePanel>
	);
};

interface TCanvasPanelProps {
	editor: TEditor;
}
