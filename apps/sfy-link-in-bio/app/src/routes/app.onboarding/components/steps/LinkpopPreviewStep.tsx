import { useNavigate } from '@remix-run/react';
import { Banner, Button } from '@shopify/polaris';
import React from 'react';
import { ScanEyeIcon, SitePreview } from '@/components';
import { resolveSite, StaticNodeCanvas } from '@/features/page-editor';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const LinkpopPreviewStep: React.FC<TLinkpopPreviewStepProps> = (props) => {
	const { onboardingContext } = props;
	const navigate = useNavigate();

	const resolvedSite = React.useMemo(() => {
		const currentStep = onboardingContext.stepr.current.get();
		return currentStep.type === 'linkpop-preview' && currentStep.site
			? resolveSite(currentStep.site)
			: null;
	}, [onboardingContext]);

	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(
		resolvedSite == null ? 'Failed to load preview' : null
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleContinue = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const result = await onboardingContext.continueFromLinkpopPreview();
		if (result.isErr()) {
			setError(result.error);
			setIsLoading(false);
			return;
		}

		navigate('/app?openEditor=true', {
			replace: true, // To prevent back navigation
			state: { fromOnboarding: true }
		});
	}, [navigate, onboardingContext]);

	const handleBack = React.useCallback(() => {
		onboardingContext.goBack();
	}, [onboardingContext]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<StepLayout
			icon={<ScanEyeIcon className="size-4" />}
			title="Preview Import"
			description="Preview how your Link In Bio page will look after importing"
			contentClassName="flex flex-col gap-6"
		>
			{resolvedSite != null && (
				<div className="relative left-1/2 w-[640px] -translate-x-1/2">
					<SitePreview
						url="preview"
						content={<StaticNodeCanvas nodes={[resolvedSite.root]} />}
						disableUrlClick
					/>
				</div>
			)}

			{error != null && (
				<Banner tone="critical" onDismiss={() => setError(null)}>
					{error}
				</Banner>
			)}

			<div className="flex flex-col gap-2">
				<Button
					variant="primary"
					size="large"
					fullWidth
					onClick={handleContinue}
					loading={isLoading}
					disabled={isLoading}
				>
					Import & Continue to editor
				</Button>

				<Button variant="monochromePlain" onClick={handleBack} disabled={isLoading}>
					Go back
				</Button>
			</div>
		</StepLayout>
	);
};

interface TLinkpopPreviewStepProps {
	onboardingContext: TOnboardingContext;
}
