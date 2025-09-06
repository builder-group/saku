import { shortId } from '@blgc/utils';
import { useAppBridge } from '@shopify/app-bridge-react';
import { BlockStack, Button, Card, InlineStack, Text } from '@shopify/polaris';
import React from 'react';
import { requestReview } from '@/lib';
import { PolarisChatIcon } from '../../display';
import { useCrisp } from '../../provider';

export const FeedbackCard: React.FC<TFeedbackCardProps> = (props) => {
	const { email, reviewUrl } = props;
	const shopify = useAppBridge();
	const crisp = useCrisp();

	const [feedbackState, setFeedbackState] = React.useState<TFeedbackState>('initial');
	const improveRequestUrl = React.useMemo(() => {
		const subject = encodeURIComponent('Saku Link In Bio - Feedback for Improvement');
		const body = encodeURIComponent('Hi,\n\nI have some feedback about Saku Link In Bio:\n\n');
		return `mailto:${email}?subject=${subject}&body=${body}`;
	}, [email]);

	const handlePositiveFeedback = React.useCallback(async () => {
		setFeedbackState('positive');
		await requestReview(shopify);
	}, [shopify]);

	const handleNegativeFeedback = React.useCallback(() => {
		setFeedbackState('negative');
	}, []);

	const handleStartChat = React.useCallback(() => {
		crisp?.openChat();
		crisp?.startThread(`feedback-card_${shortId()}`);
		crisp?.showMessageAsOperator(
			'text',
			"Hi! I'd love to help you with your experience. What went wrong?"
		);
	}, [crisp]);

	switch (feedbackState) {
		case 'positive':
			return (
				<Card>
					<BlockStack gap="300">
						<Text as="h2" variant="headingMd">
							Take a minute to help us grow 🙏
						</Text>
						<Text as="p" variant="bodyMd" tone="subdued">
							A quick review would mean the world to us - we really appreciate your support!
						</Text>
						<InlineStack gap="200">
							<Button variant="primary" url={reviewUrl} target="_blank">
								Leave a review
							</Button>
						</InlineStack>
					</BlockStack>
				</Card>
			);
		case 'negative':
			return (
				<Card>
					<BlockStack gap="300">
						<Text as="h2" variant="headingMd">
							Let's fix this together
						</Text>
						<Text as="p" variant="bodyMd" tone="subdued">
							We're sorry you had a bad experience. Let's chat and get this resolved right away!
						</Text>
						<BlockStack gap="200">
							<Button
								variant="primary"
								icon={PolarisChatIcon}
								onClick={handleStartChat}
								disabled={crisp == null}
							>
								Start Chat & Get Help
							</Button>
							<Button variant="secondary" url={improveRequestUrl} target="_blank">
								Send Email Feedback
							</Button>
						</BlockStack>
					</BlockStack>
				</Card>
			);
		case 'initial':
			return (
				<Card>
					<BlockStack gap="300">
						<Text as="h2" variant="headingMd">
							Share your feedback
						</Text>
						<Text as="p" variant="bodyMd" tone="subdued">
							How would you describe your experience using Saku Link In Bio?
						</Text>
						<InlineStack gap="200">
							<Button variant="secondary" onClick={handlePositiveFeedback}>
								👍 Good
							</Button>
							<Button variant="secondary" onClick={handleNegativeFeedback}>
								👎 Bad
							</Button>
						</InlineStack>
					</BlockStack>
				</Card>
			);
	}
};

interface TFeedbackCardProps {
	email: string;
	reviewUrl: string;
}

type TFeedbackState = 'initial' | 'positive' | 'negative';
