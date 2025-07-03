import { Button, Text } from '@shopify/polaris';
import React from 'react';
import { LogoIcon } from '@/components';
import type { TOnboardingContext } from '../../create-onboarding-context';

export const WelcomeStep: React.FC<TWelcomeStepProps> = (props) => {
	const { onboardingContext } = props;

	// =========================================================================
	// Events
	// =========================================================================

	const handleGetStarted = React.useCallback(() => {
		onboardingContext.continueFromWelcome();
	}, [onboardingContext]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="relative mx-auto flex w-full max-w-sm flex-col items-center px-3 pt-8 text-center md:px-8 md:pt-20">
			<LogoIcon className="size-16" />

			<div className="mt-4">
				<Text as="h1" variant="heading2xl" alignment="center">
					Welcome to Saku
				</Text>
			</div>

			<div className="mt-2">
				<Text as="p" variant="bodyLg" tone="subdued" alignment="center">
					Transform your social media bio link into a sales-focused landing page
				</Text>
			</div>

			<div className="mt-10 w-full">
				<Button variant="primary" size="large" fullWidth onClick={handleGetStarted}>
					Get started
				</Button>
			</div>
		</div>
	);
};

interface TWelcomeStepProps {
	onboardingContext: TOnboardingContext;
}
