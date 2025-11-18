import { Button } from '@shopify/polaris';
import React from 'react';
import { useConfetti } from '@/hooks';
import { TPageEditor } from '../../lib';

export const SaveButton: React.FC<TSaveButtonProps> = (props) => {
	const { editor } = props;

	const [isSaveing, setIsSaveing] = React.useState(false);
	const triggerConfetti = useConfetti();

	const handleSave = React.useCallback(async () => {
		setIsSaveing(true);
		const isSaveed = await editor.publishSite();
		if (isSaveed) {
			triggerConfetti();
		}
		setIsSaveing(false);
	}, [editor, triggerConfetti]);

	return (
		<Button variant="primary" onClick={handleSave} disabled={isSaveing} loading={isSaveing}>
			Save
		</Button>
	);
};

interface TSaveButtonProps {
	editor: TPageEditor;
}
