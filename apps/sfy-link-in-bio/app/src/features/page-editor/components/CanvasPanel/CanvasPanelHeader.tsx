import { Button, InlineStack } from '@shopify/polaris';
import React from 'react';
import { ViewIcon } from '@/components';
import { TPageEditor } from '../../lib';
import { PanelHeader } from '../PanelHeader';

export const CanvasPanelHeader: React.FC<TCanvasPanelHeaderProps> = (props) => {
	const { editor } = props;

	const [isSaving, setIsSaving] = React.useState(false);

	const handleSave = React.useCallback(async () => {
		setIsSaving(true);
		const isSaved = await editor.save();
		if (isSaved) {
			editor.shopify.toast.show('Saved');
		} else {
			editor.shopify.toast.show('Failed to save');
		}
		setIsSaving(false);
	}, [editor]);

	return (
		<PanelHeader className="h-12 justify-end">
			<InlineStack gap="200" blockAlign="center">
				<Button
					icon={ViewIcon}
					variant="secondary"
					url={'todo'}
					target="_blank"
					accessibilityLabel="Visit your Link In Bio page"
				/>
				<Button variant="primary" onClick={handleSave} disabled={isSaving}>
					{isSaving ? 'Saving...' : 'Save'}
				</Button>
			</InlineStack>
		</PanelHeader>
	);
};

interface TCanvasPanelHeaderProps {
	editor: TPageEditor;
}
