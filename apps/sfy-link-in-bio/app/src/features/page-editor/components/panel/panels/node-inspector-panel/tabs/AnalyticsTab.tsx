import { Button, Text } from '@shopify/polaris';
import React from 'react';
import { appConfig } from '@/environment';
import { TNodeState, TPageEditor } from '../../../../../lib';

export const AnalyticsTab: React.FC<TAnalyticsTabProps> = (props) => {
	const { editor } = props;
	const analyticsRequestUrl = React.useMemo(() => {
		const subject = encodeURIComponent('Inline analytics request');
		const body = encodeURIComponent(
			[
				'Hi Saku team,',
				'',
				"I'd love built-in inline analytics for my page.",
				'',
				'What I would like to track:',
				'- ',
				'',
				'Thanks!'
			].join('\n')
		);
		return `mailto:${appConfig.help.email}?subject=${subject}&body=${body}`;
	}, []);

	const handleOpenIntegrations = React.useCallback(() => {
		editor.switchView({
			type: 'settings',
			view: { type: 'integrations' }
		});
	}, [editor]);

	return (
		<div className="space-y-4 p-4">
			<div className="space-y-3 rounded-lg bg-neutral-50 p-4">
				<div className="space-y-1">
					<Text as="h3" variant="headingMd">
						Track with Google Analytics
					</Text>
					<Text as="p" variant="bodyMd" tone="subdued">
						You can already track pageviews and click events by adding Google Analytics or Meta
						Pixel in Integrations.
					</Text>
				</div>
				<Button onClick={handleOpenIntegrations}>Open Integrations</Button>
			</div>

			<div className="space-y-2 rounded-lg border border-dashed border-neutral-200 p-4">
				<Text as="h3" variant="headingMd">
					Want built-in analytics?
				</Text>
				<Text as="p" variant="bodyMd" tone="subdued">
					If enough people want inline analytics inside Saku, we can build it. Send us a feature
					request and tell us what you would want to measure.
				</Text>
				<Button variant="plain" url={analyticsRequestUrl} target="_top">
					Request inline analytics
				</Button>
			</div>
		</div>
	);
};

interface TAnalyticsTabProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}
