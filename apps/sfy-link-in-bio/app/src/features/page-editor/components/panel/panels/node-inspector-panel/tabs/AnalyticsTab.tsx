import { Text } from '@shopify/polaris';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../../../lib';

export const AnalyticsTab: React.FC<TAnalyticsTabProps> = (props) => {
	const { nodeState } = props;

	return (
		<div className="space-y-4 p-4">
			<div className="rounded-lg bg-neutral-50 p-4">
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

interface TAnalyticsTabProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}
