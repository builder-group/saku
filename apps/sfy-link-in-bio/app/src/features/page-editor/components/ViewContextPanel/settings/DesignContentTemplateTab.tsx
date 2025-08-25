import { Text } from '@shopify/polaris';
import React from 'react';
import { TPageEditor } from '../../../lib';

export const DesignContentTemplateTab: React.FC<TDesignContentTemplateTabProps> = (props) => {
	const { editor } = props;

	return (
		<div className="space-y-4 p-4">
			<div className="rounded-lg bg-gray-50 p-4">
				<Text as="p" variant="bodyMd" tone="subdued">
					🧩 Template Content (coming soon)
				</Text>
				<p className="mt-2 text-sm text-gray-600">
					Choose from curated templates to quickly set up your page.
				</p>
			</div>
		</div>
	);
};

interface TDesignContentTemplateTabProps {
	editor: TPageEditor;
}
