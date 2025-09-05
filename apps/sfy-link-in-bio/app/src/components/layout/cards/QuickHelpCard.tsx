import { shortId } from '@blgc/utils';
import { BlockStack, Button, Card, Text } from '@shopify/polaris';
import React from 'react';
import { PolarisChatIcon, PolarisQuestionCircleIcon } from '@/components/display/icons';
import { useCrisp } from '../../provider';

export const QuickHelpCard: React.FC<TQuickHelpCardProps> = (props) => {
	const { helpPageUrl = '/app/help' } = props;
	const crisp = useCrisp();

	const handleStartChat = React.useCallback(() => {
		crisp?.openChat();
		setTimeout(() => {
			crisp?.startThread(`quick-help-card_${shortId()}`);
			crisp?.showMessageAsOperator(
				'text',
				'Hi! I’m here to help you with any questions or issues you might have.'
			);
		}, 1000);
	}, [crisp]);

	return (
		<Card>
			<BlockStack gap="300">
				<Text as="h2" variant="headingMd">
					Need help?
				</Text>
				<BlockStack gap="200">
					<Button
						fullWidth
						variant="secondary"
						icon={PolarisChatIcon}
						onClick={handleStartChat}
						disabled={crisp == null}
					>
						Start Chat
					</Button>
					<Button fullWidth variant="secondary" icon={PolarisQuestionCircleIcon} url={helpPageUrl}>
						Help & Resources
					</Button>
				</BlockStack>
			</BlockStack>
		</Card>
	);
};

interface TQuickHelpCardProps {
	helpPageUrl?: string;
}

// Keep the old export for backward compatibility
export const GetInTouchCard = QuickHelpCard;
