import { Button } from '@shopify/polaris';
import React from 'react';
import { useConfetti } from '@/hooks';
import { TPageEditor } from '../../lib';

export const PublishButton: React.FC<TPublishButtonProps> = (props) => {
	const { editor } = props;

	const [isPublishing, setIsPublishing] = React.useState(false);
	const triggerConfetti = useConfetti();

	const handlePublish = React.useCallback(async () => {
		setIsPublishing(true);
		const isPublished = await editor.publishSite();
		if (isPublished) {
			triggerConfetti();
		}
		setIsPublishing(false);
	}, [editor, triggerConfetti]);

	return (
		<Button
			variant="primary"
			onClick={handlePublish}
			disabled={isPublishing}
			loading={isPublishing}
		>
			Publish
		</Button>
	);
};

interface TPublishButtonProps {
	editor: TPageEditor;
}
