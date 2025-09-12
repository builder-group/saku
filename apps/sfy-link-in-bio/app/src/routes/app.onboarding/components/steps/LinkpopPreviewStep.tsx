import { Banner, Button } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { unwrapOrNull } from 'tuple-result';
import { ScanEyeIcon, SitePreview } from '@/components';
import {
	createPageContext,
	resolveSite,
	StaticNodeCanvas,
	StaticSiteResolveContext
} from '@/features/page-editor';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const LinkpopPreviewStep: React.FC<TLinkpopPreviewStepProps> = (props) => {
	const { onboardingContext } = props;
	const navigate = useNavigate();

	const resolvedSite = useCompute(onboardingContext.stepr.current, ({ value: currentStep }) => {
		return currentStep.type === 'linkpop-preview' && currentStep.site
			? unwrapOrNull(resolveSite(new StaticSiteResolveContext(currentStep.site)))
			: null;
	});
	const cx = React.useMemo(
		() =>
			createPageContext({
				siteId: 'preview',
				integrations: []
			}),
		[]
	);

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

		await onboardingContext.complete();
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
			contentClassName="flex flex-col items-center gap-6 min-h-0 max-w-xl"
		>
			{resolvedSite != null && (
				<div className="w-full">
					<SitePreview
						url="preview"
						content={<StaticNodeCanvas cx={cx} nodes={[resolvedSite.root]} />}
						disableUrlClick
					/>
				</div>
			)}

			{error != null && (
				<Banner tone="critical" onDismiss={() => setError(null)}>
					{error}
				</Banner>
			)}

			<div className="flex w-full max-w-sm flex-col gap-2">
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
