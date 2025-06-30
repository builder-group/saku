import { Button, InlineStack } from '@shopify/polaris';
import React from 'react';
import { PageDownIcon, ViewIcon } from '@/components';
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

	const handleJSONExport = React.useCallback(() => {
		const json = JSON.stringify(editor.toSite(), null, 2);

		// Copy to clipboard
		navigator.clipboard
			.writeText(json)
			.then(() => {
				editor.shopify.toast.show('JSON copied to clipboard');
			})
			// Fallback: Download as file
			.catch(() => {
				const blob = new Blob([json], { type: 'application/json' });
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `site-${editor.site.id}.json`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
				editor.shopify.toast.show('JSON downloaded');
			});
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
				<Button
					icon={PageDownIcon}
					variant="secondary"
					onClick={handleJSONExport}
					accessibilityLabel="Export as JSON"
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
