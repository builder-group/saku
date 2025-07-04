import { Button } from '@shopify/polaris';
import { useCompute } from 'feature-react';
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

	const canPreview = useCompute(editor.activeView, (view) => view !== 'preview');
	const canExportJson = useCompute(editor.activeView, (view) => view === 'preview');

	// =========================================================================
	// Events
	// =========================================================================

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
		editor.switchView('preview');
	}, [editor]);

	const handleJsonExport = React.useCallback(() => {
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

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<PanelHeader className="h-12 justify-end">
			<div className="flex items-center gap-2">
				{canExportJson && (
					<Button
						icon={PageDownIcon}
						variant="secondary"
						onClick={handleJsonExport}
						accessibilityLabel="Export as JSON"
					/>
				)}
				{canPreview && (
					<Button
						icon={ViewIcon}
						variant="secondary"
						onClick={handlePreview}
						accessibilityLabel="Preview your Link In Bio page"
					/>
				)}
				<Button
					variant="primary"
					onClick={handlePublish}
					disabled={isPublishing}
					loading={isPublishing}
				>
					Publish
				</Button>
			</div>
		</PanelHeader>
	);
};

interface TCanvasPanelHeaderProps {
	editor: TPageEditor;
}
