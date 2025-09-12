import { shortId } from '@blgc/utils';
import { Button, Text } from '@shopify/polaris';
import React from 'react';
import { PolarisChatIcon, PolarisQuestionCircleIcon } from '@/components/display/icons';
import { useCrisp } from '../../provider';

export const QuickHelpSection: React.FC<TQuickHelpSectionProps> = (props) => {
	const { helpPageUrl = '/app/help' } = props;
	const crisp = useCrisp();

	const handleStartChat = React.useCallback(() => {
		crisp?.openChat();
		setTimeout(() => {
			crisp?.startThread(`quick-help-section_${shortId()}`);
			crisp?.showMessageAsOperator(
				'text',
				"Hi! I'm here to help you with any questions or issues you might have."
			);
		}, 1000);
	}, [crisp]);

	return (
		<s-section>
			<div className="space-y-3">
				<div>
					<Text as="h2" variant="headingMd">
						Need help?
					</Text>
				</div>
				<div className="space-y-2">
					<div>
						<Button
							variant="secondary"
							icon={PolarisChatIcon}
							onClick={handleStartChat}
							disabled={crisp == null}
							fullWidth
						>
							Start Chat
						</Button>
					</div>
					<div>
						<Button
							variant="secondary"
							icon={PolarisQuestionCircleIcon}
							url={helpPageUrl}
							fullWidth
						>
							Help & Resources
						</Button>
					</div>
				</div>
			</div>
		</s-section>
	);
};

interface TQuickHelpSectionProps {
	helpPageUrl?: string;
}
