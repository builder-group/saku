import { Banner, Button, Spinner, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { unwrapOrNull } from 'tuple-result';
import { IframePortal, ScanEyeIcon, SitePreview } from '@/components';
import {
	createPageContext,
	getFontUrls,
	resolveSite,
	StaticNodeCanvas,
	StaticSiteResolveContext
} from '@/features/page-editor';
import tailwindStylesHref from '@/styles.css?url';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const SitePreviewStep: React.FC<TSitePreviewStepProps> = (props) => {
	const { onboardingContext } = props;
	const navigate = useNavigate();

	const resolvedSite = useCompute(onboardingContext.stepr.current, ({ value: currentStep }) => {
		return currentStep.type === 'site-preview' && currentStep.site
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

	const links = useCompute(
		onboardingContext.stepr.current,
		({ value: currentStep }) => {
			if (currentStep.type === 'site-preview' && currentStep.site) {
				return [
					{ rel: 'stylesheet', href: tailwindStylesHref },
					...getFontUrls(currentStep.site.assets).map((url) => ({ rel: 'stylesheet', href: url }))
				];
			}
			return [];
		},
		[]
	);
	const [stylesLoaded, setStylesLoaded] = React.useState(false);

	const [isLoading, setIsLoading] = React.useState(false);
	const loadingStatusMessages = React.useMemo(
		() => [
			'Finalizing your site...',
			'Uploading media...',
			'Saving to your workspace...',
			'Almost done!'
		],
		[]
	);
	const [loadingStatusMessage, setLoadingStatusMessage] = React.useState(loadingStatusMessages[0]);

	const [error, setError] = React.useState<string | null>(
		resolvedSite == null ? 'Failed to load preview' : null
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleContinue = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const result = await onboardingContext.continueFromSitePreview();
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
	// Effects
	// =========================================================================

	React.useEffect(() => {
		if (!isLoading) {
			return;
		}

		let count = 0;
		const interval = setInterval(() => {
			count += 1;
			const index = count % loadingStatusMessages.length;
			setLoadingStatusMessage(loadingStatusMessages[index]);
		}, 4000);

		return () => {
			clearInterval(interval);
		};
	}, [isLoading, loadingStatusMessages]);

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
						content={
							<>
								{!stylesLoaded && (
									<div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-neutral-50">
										<Spinner accessibilityLabel="Loading preview..." size="small" />
									</div>
								)}
								<IframePortal
									links={links}
									onStylesLoaded={() => setStylesLoaded(true)}
									className="h-full w-full"
								>
									<div className="h-full w-full overflow-y-hidden">
										<StaticNodeCanvas cx={cx} nodes={[resolvedSite.root]} />
									</div>
								</IframePortal>
							</>
						}
						disableUrlClick
					/>
				</div>
			)}

			{error != null && (
				<Banner tone="critical" onDismiss={() => setError(null)}>
					{error}
				</Banner>
			)}

			{isLoading && (
				<div className="space-y-1 text-center">
					<Text as="p" tone="subdued">
						{loadingStatusMessage}
					</Text>
					<Text as="p" tone="subdued" variant="bodySm">
						This may take a few moments if your site has many assets.
					</Text>
				</div>
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

interface TSitePreviewStepProps {
	onboardingContext: TOnboardingContext;
}
