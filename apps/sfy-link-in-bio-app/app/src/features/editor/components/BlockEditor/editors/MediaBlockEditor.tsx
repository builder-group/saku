import { Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { TMediaBlock } from '../../../environment';
import { TBlockEditorComponentProps } from '../blockEditorsRegistry';

export const MediaBlockEditor: React.FC<TBlockEditorComponentProps<TMediaBlock>> = (props) => {
	const { blockState } = props;
	const block = useFeatureState(blockState);

	return (
		<div className="space-y-4">
			<Text as="p" variant="bodyMd">
				Media Block Editor - Coming Soon
			</Text>
			<Text as="p" variant="bodySm" tone="subdued">
				Block ID: {block.id}
			</Text>
		</div>
	);
};
