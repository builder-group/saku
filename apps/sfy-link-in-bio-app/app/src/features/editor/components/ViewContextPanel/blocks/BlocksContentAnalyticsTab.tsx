import { Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { TBlock } from '../../../environment';
import { TEditor } from '../../../lib';

export const BlocksContentAnalyticsTab: React.FC<TBlocksContentAnalyticsTabProps> = (props) => {
	const { blockState } = props;
	const block = useFeatureState(blockState);

	return (
		<div className="space-y-4 p-4">
			<div className="rounded-lg bg-gray-50 p-4">
				<Text as="p" variant="bodyMd" tone="subdued">
					📊 Coming Soon:
				</Text>
				<ul className="mt-2 space-y-1 text-sm text-gray-600">
					<li>• Click-through rates</li>
					<li>• Engagement metrics</li>
					<li>• Performance insights</li>
					<li>• A/B testing results</li>
				</ul>
			</div>
		</div>
	);
};

interface TBlocksContentAnalyticsTabProps {
	blockState: TState<TBlock, []>;
	editor: TEditor;
}
