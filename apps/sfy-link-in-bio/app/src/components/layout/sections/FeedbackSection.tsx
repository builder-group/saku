import { shortId } from '@blgc/utils';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, Text } from '@shopify/polaris';
import React from 'react';
import { requestReview } from '@/lib';
import { PolarisChatIcon } from '../../display';
import { useCrisp } from '../../provider';

export const FeedbackSection: React.FC<TFeedbackSectionProps> = (props) => {
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
		crisp?.startThread(`feedback-section_${shortId()}`);
		crisp?.showMessageAsOperator(
			'text',
			"Hi! I'd love to help you with your experience. What went wrong?"
		);
	}, [crisp]);

	switch (feedbackState) {
		case 'positive':
			return (
				<s-section>
					<div className="space-y-3">
						<div>
							<Text as="h2" variant="headingMd">
								Take a minute to help us grow 🙏
							</Text>
						</div>
						<div>
							<Text as="p" variant="bodyMd" tone="subdued">
								A quick review would mean the world to us - we really appreciate your support!
							</Text>
						</div>
						<div>
							<Button variant="primary" url={reviewUrl} target="_blank">
								Leave a review
							</Button>
						</div>
					</div>
				</s-section>
			);
		case 'negative':
			return (
				<s-section>
					<div className="space-y-3">
						<div>
							<Text as="h2" variant="headingMd">
								Let's fix this together
							</Text>
						</div>
						<div>
							<Text as="p" variant="bodyMd" tone="subdued">
								We're sorry you had a bad experience. Let's chat and get this resolved right away!
							</Text>
						</div>
						<div className="space-y-2">
							<div>
								<Button
									variant="primary"
									icon={PolarisChatIcon}
									onClick={handleStartChat}
									disabled={crisp == null}
									fullWidth
								>
									Start Chat & Get Help
								</Button>
							</div>
							<div>
								<Button variant="secondary" url={improveRequestUrl} target="_blank" fullWidth>
									Send Email Feedback
								</Button>
							</div>
						</div>
					</div>
				</s-section>
			);
		case 'initial':
			return (
				<s-section>
					<div className="space-y-3">
						<div>
							<Text as="h2" variant="headingMd">
								Share your feedback
							</Text>
						</div>
						<div>
							<Text as="p" variant="bodyMd" tone="subdued">
								How would you describe your experience using Saku Link In Bio?
							</Text>
						</div>
						<div className="flex gap-2">
							<div>
								<Button variant="secondary" onClick={handlePositiveFeedback}>
									👍 Good
								</Button>
							</div>
							<div>
								<Button variant="secondary" onClick={handleNegativeFeedback}>
									👎 Bad
								</Button>
							</div>
						</div>
					</div>
				</s-section>
			);
	}
};

interface TFeedbackSectionProps {
	email: string;
	reviewUrl: string;
}

type TFeedbackState = 'initial' | 'positive' | 'negative';
