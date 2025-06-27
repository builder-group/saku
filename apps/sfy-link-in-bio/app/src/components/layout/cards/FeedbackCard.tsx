import { BlockStack, Button, Card, InlineStack, Text } from '@shopify/polaris';
import React from 'react';

export const FeedbackCard: React.FC<TFeedbackCardProps> = (props) => {
	const { email, reviewUrl } = props;

	const [feedbackState, setFeedbackState] = React.useState<TFeedbackState>('initial');
	const improveRequestUrl = React.useMemo(() => {
		const subject = encodeURIComponent('Saku Link In Bio - Feedback for Improvement');
		const body = encodeURIComponent('Hi,\n\nI have some feedback about Saku Link In Bio:\n\n');
		return `mailto:${email}?subject=${subject}&body=${body}`;
	}, []);

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
							Please let us know how we can improve
						</Text>
						<Text as="p" variant="bodyMd" tone="subdued">
							We're sorry to hear that you had a bad experience. Let us fix it!
						</Text>
						<InlineStack gap="200">
							<Button variant="primary" url={improveRequestUrl} target="_blank">
								Let us know how we can improve
							</Button>
						</InlineStack>
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
							<Button variant="secondary" onClick={() => setFeedbackState('positive')}>
								👍 Good
							</Button>
							<Button variant="secondary" onClick={() => setFeedbackState('negative')}>
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
