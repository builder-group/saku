import { Button } from '@shopify/polaris';
import React from 'react';
import { ViewIcon } from '@/components';
import { useConfetti } from '@/hooks';
import { TPageEditor } from '../../lib';
import { PanelHeader } from '../PanelHeader';

export const CanvasPanelHeader: React.FC<TCanvasPanelHeaderProps> = (props) => {
	const { editor } = props;

	const [isPublishing, setIsPublishing] = React.useState(false);
	const triggerConfetti = useConfetti();

	// =========================================================================
	// Events
	// =========================================================================

	const handlePublish = React.useCallback(async () => {
		setIsPublishing(true);
		const isPublished = await editor.publish();
		if (isPublished) {
			triggerConfetti();
		}
		setIsPublishing(false);
	}, [editor, triggerConfetti]);

	const handlePreview = React.useCallback(() => {
		editor.switchView('preview');
	}, [editor]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<PanelHeader className="h-12 justify-end">
			<div className="flex items-center gap-2">
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
			</div>
		</PanelHeader>
	);
};

interface TCanvasPanelHeaderProps {
	editor: TPageEditor;
}
