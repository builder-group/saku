import { Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { TEditor } from '../../lib';
import { BlocksContentPlaceholder } from './BlocksContentPlaceholder';

export const BlocksContent: React.FC<TBlocksContentProps> = (props) => {
	const { editor } = props;

	const selectedBlockId = useFeatureState(editor.selectedBlockId);

	if (selectedBlockId == null) {
		return <BlocksContentPlaceholder />;
	}

	return (
		<div>
			<Text as="p" variant="bodyMd">
				Selected block {selectedBlockId}
			</Text>
		</div>
	);
};

interface TBlocksContentProps {
	editor: TEditor;
}
