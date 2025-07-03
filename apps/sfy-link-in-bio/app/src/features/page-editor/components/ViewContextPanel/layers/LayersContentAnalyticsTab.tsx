import { TNode } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import React from 'react';
import { TFlattenedNode, TPageEditor } from '../../../lib';

export const LayersContentAnalyticsTab: React.FC<TLayersContentAnalyticsTabProps> = (props) => {
	const { nodeState } = props;

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

interface TLayersContentAnalyticsTabProps {
	nodeState: TState<TFlattenedNode<TNode>, []>;
	editor: TPageEditor;
}
