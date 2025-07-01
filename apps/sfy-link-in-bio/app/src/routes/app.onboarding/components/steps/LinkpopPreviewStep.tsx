import { Button } from '@shopify/polaris';
import React from 'react';
import { ScanEyeIcon, SitePreview } from '@/components';
import { kangarooPreset, resolveSite, StaticNodeCanvas } from '@/features/page-editor';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const LinkpopPreviewStep: React.FC<TLinkpopPreviewStepProps> = (props) => {
	const { onboardingContext } = props;

	const resolvedSite = React.useMemo(() => resolveSite(kangarooPreset), []);

	const handleContinue = React.useCallback(async () => {
		// TODO: Import the site and continue to editor
	}, []);

	const handleBack = React.useCallback(() => {
		onboardingContext.stepr.goBack();
	}, [onboardingContext]);

	return (
		<StepLayout
			icon={<ScanEyeIcon className="size-4" />}
			title="Preview Import"
			description="Preview how your Saku site will look after importing"
			contentClassName="flex flex-col gap-6"
		>
			<div className="relative left-1/2 w-[640px] -translate-x-1/2">
				<SitePreview
					url="preview"
					content={<StaticNodeCanvas nodes={[resolvedSite.root]} />}
					disableUrlClick
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Button variant="primary" size="large" fullWidth onClick={handleContinue}>
					Import & Continue to editor
				</Button>

				<Button variant="monochromePlain" onClick={handleBack}>
					Go back
				</Button>
			</div>
		</StepLayout>
	);
};

interface TLinkpopPreviewStepProps {
	onboardingContext: TOnboardingContext;
}
