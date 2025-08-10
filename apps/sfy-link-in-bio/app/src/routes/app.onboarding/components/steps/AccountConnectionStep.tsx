import { AccountConnection, Button, Link } from '@shopify/polaris';
import React from 'react';
import { ShopifyIcon } from '@/components';
import { createDisplayNameFromShop } from '../../../../lib';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const AccountConnectionStep: React.FC<TAccountConnectionStepProps> = (props) => {
	const { onboardingContext } = props;

	const [isConnected, setIsConnected] = React.useState(false);

	// =========================================================================
	// Events
	// =========================================================================

	const handleAction = React.useCallback(() => {
		setIsConnected((connected) => !connected);
	}, []);

	const handleContinue = React.useCallback(async () => {
		onboardingContext.continueFromAccountConnection();
	}, [onboardingContext]);

	const handleBack = React.useCallback(() => {
		onboardingContext.goBack();
	}, [onboardingContext]);

	// =========================================================================
	// UI
	// =========================================================================

	const { shopDisplayName, buttonText, detailsText, terms } = React.useMemo(() => {
		return {
			shopDisplayName: createDisplayNameFromShop(onboardingContext.shopId),
			buttonText: isConnected ? 'Disconnect' : 'Connect',
			detailsText: isConnected ? 'Account connected' : 'No account connected',
			terms: isConnected ? null : (
				<p>
					By clicking <strong>Connect</strong>, you agree to accept Saku's{' '}
					<Link url="/legal/terms-of-service" target="_blank">
						terms and conditions
					</Link>
					. You'll be able to create and manage your bio pages directly in your Shopify admin.
				</p>
			)
		};
	}, [isConnected, onboardingContext.shopId]);

	return (
		<StepLayout
			icon={<ShopifyIcon className="size-4" />}
			title="Connect your Shopify store"
			description="Connect your Shopify store to Saku to start creating bio pages directly in your Shopify admin"
			contentClassName="flex flex-col gap-6"
		>
			<div className="relative left-1/2 w-[490px] -translate-x-1/2 text-left">
				<AccountConnection
					accountName={shopDisplayName}
					connected={isConnected}
					title="Saku account"
					action={{
						content: buttonText,
						onAction: handleAction
					}}
					details={detailsText}
					termsOfService={terms}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Button
					variant="primary"
					size="large"
					fullWidth
					onClick={handleContinue}
					disabled={!isConnected}
				>
					Continue
				</Button>

				<Button variant="monochromePlain" onClick={handleBack}>
					Go back
				</Button>
			</div>
		</StepLayout>
	);
};

interface TAccountConnectionStepProps {
	onboardingContext: TOnboardingContext;
}
