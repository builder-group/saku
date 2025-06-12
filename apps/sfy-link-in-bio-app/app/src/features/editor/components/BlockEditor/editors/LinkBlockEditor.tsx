import { Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { TLinkBlock } from '../../../environment';
import { TBlockEditorComponentProps } from '../blockEditorsRegistry';

export const LinkBlockEditor: React.FC<TBlockEditorComponentProps<TLinkBlock>> = (props) => {
	const { blockState } = props;
	const block = useFeatureState(blockState);

	return (
		<div className="space-y-4">
			<Text as="p" variant="bodyMd">
				Link Block Editor - Coming Soon
			</Text>
			<Text as="p" variant="bodySm" tone="subdued">
				Block ID: {block.id}
			</Text>
		</div>
	);
};
