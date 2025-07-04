import { Button, InlineStack } from '@shopify/polaris';
import React from 'react';
import { PageDownIcon, ViewIcon } from '@/components';
import { useConfetti } from '@/hooks';
import { requestReview } from '@/lib';
import { TPageEditor } from '../../lib';
import { PanelHeader } from '../PanelHeader';

export const CanvasPanelHeader: React.FC<TCanvasPanelHeaderProps> = (props) => {
	const { editor } = props;

	const [isPublishing, setIsPublishing] = React.useState(false);
	const triggerConfetti = useConfetti();

	const handlePublish = React.useCallback(async () => {
		setIsPublishing(true);
		const isPublished = await editor.publish();
		if (isPublished) {
			editor.shopify.toast.show('Published');
			triggerConfetti();
			await requestReview(editor.shopify);
		} else {
			editor.shopify.toast.show('Failed to publish');
		}
		setIsPublishing(false);
	}, [editor, triggerConfetti]);

	const handlePreview = React.useCallback(() => {
		editor.shopify.toast.show(
			'Preview coming soon! For now, publish your changes and visit the live site.'
		);
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
					icon={PageDownIcon}
					variant="secondary"
					onClick={handleJSONExport}
					accessibilityLabel="Export as JSON"
				/>
				<Button
					icon={ViewIcon}
					variant="secondary"
					onClick={handlePreview}
					accessibilityLabel="Preview your Link In Bio page"
				/>
				<Button
					variant="primary"
					onClick={handlePublish}
					disabled={isPublishing}
					loading={isPublishing}
				>
					Publish
				</Button>
			</InlineStack>
		</PanelHeader>
	);
};

interface TCanvasPanelHeaderProps {
	editor: TPageEditor;
}
