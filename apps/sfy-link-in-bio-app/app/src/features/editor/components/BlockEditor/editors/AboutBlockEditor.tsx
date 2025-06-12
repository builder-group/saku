import { Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { TAboutBlock } from '../../../environment';
import { TBlockEditorComponentProps } from '../blockEditorsRegistry';

export const AboutBlockEditor: React.FC<TBlockEditorComponentProps<TAboutBlock>> = (props) => {
	const { blockState } = props;
	const block = useFeatureState(blockState);

	return (
		<div className="space-y-4">
			<Text as="p" variant="bodyMd">
				About Block Editor - Coming Soon
			</Text>
			<Text as="p" variant="bodySm" tone="subdued">
				Block ID: {block.id}
			</Text>
		</div>
	);
};
