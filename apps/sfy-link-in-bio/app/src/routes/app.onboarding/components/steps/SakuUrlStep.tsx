import { parseUrl } from '@repo/editor';
import { Banner, Button } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { LinkIcon } from '@/components';
import { appConfig } from '@/environment';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

const SUPPORTED_SAKU_HOSTNAMES = ['saku.so', 'www.saku.so', 'sfy-link-in-bio-app.saku.so'];

export const SakuUrlStep: React.FC<TSakuUrlStepProps> = (props) => {
	const { onboardingContext } = props;

	const initialHandle = useCompute(onboardingContext.stepr.current, ({ value: currentStep }) => {
		return currentStep.type === 'saku-url' && currentStep.workspaceHandle && currentStep.siteHandle
			? `${currentStep.workspaceHandle}/${currentStep.siteHandle}`
			: '';
	});
	const [displayHandle, setDisplayHandle] = React.useState(initialHandle);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<{ message: string; showFallback: boolean } | null>(null);
	const [retryCount, setRetryCount] = React.useState(0);

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setDisplayHandle(e.target.value);
		setError(null);
		setRetryCount(0);
	}, []);

	const handleUrlPaste = React.useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
		const pastedText = e.clipboardData.getData('text');

		const url = parseUrl(pastedText);
		if (url == null || !SUPPORTED_SAKU_HOSTNAMES.includes(url.hostname.toLowerCase())) {
			return;
		}

		const pathSegments = url.pathname.split('/').filter(Boolean);
		if (pathSegments.length < 3 || pathSegments[0] !== 'w') {
			return;
		}

		const workspaceHandle = pathSegments[1];
		const siteHandle = pathSegments[2];
		if (workspaceHandle == null || siteHandle == null) {
			return;
		}

		setDisplayHandle(`${workspaceHandle}/${siteHandle}`);
		e.preventDefault();
	}, []);

	const handleContinue = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		// Parse workspace/site from the handle input
		const trimmedHandle = displayHandle.trim();
		const parts = trimmedHandle.split('/');
		if (parts.length !== 2) {
			setError({
				message: 'Please enter the format: workspace/site (e.g., saku-demo/bio)',
				showFallback: false
			});
			setIsLoading(false);
			return;
		}
		const [workspaceHandle = '', siteHandle = ''] = parts;

		const [isContinueOk, continueErr] = await onboardingContext.continueFromExternalSiteUrl(
			'saku',
			`${appConfig.platformUrl(workspaceHandle)}/${siteHandle}`
		);
		if (!isContinueOk) {
			const newRetryCount = retryCount + 1;
			setRetryCount(newRetryCount);
			setError({
				message: continueErr.message,
				// Show fallback options after 3 attempts or Saku site is not found (404)
				showFallback: continueErr.isNotFound || newRetryCount >= 3
			});
			setIsLoading(false);
		}
	}, [onboardingContext, displayHandle, retryCount]);

	const handleFallbackToTheme = React.useCallback(() => {
		onboardingContext.stepr.goTo({
			type: 'theme'
		});
	}, [onboardingContext]);

	const handleBack = React.useCallback(() => {
		onboardingContext.goBack();
	}, [onboardingContext]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<StepLayout
			icon={<LinkIcon className="size-4" />}
			title="Import from Saku"
			description="Enter workspace/site (e.g. my-store/bio) — find this in your existing Saku bio page URL"
			contentClassName="flex flex-col gap-6"
		>
			<div className="flex">
				<div className="flex items-center rounded-l-[var(--p-border-radius-200)] border-y border-l border-[var(--p-color-input-border)] bg-neutral-100 px-3 text-[var(--p-color-text-subdued)]">
					saku.so/w/
				</div>
				<div className="relative flex flex-1 items-center">
					<input
						type="text"
						value={displayHandle}
						onChange={handleChange}
						onPaste={handleUrlPaste}
						placeholder="workspace/site"
						className="relative z-20 w-full appearance-none border-none bg-transparent px-3 py-2 leading-[var(--p-font-line-height-500)] text-[var(--p-color-text)] outline-none placeholder:text-[var(--p-color-text-subdued)]"
						autoComplete="off"
						spellCheck="false"
					/>
					<div className="pointer-events-none absolute inset-0 z-10 rounded-r-[var(--p-border-radius-200)] border border-[var(--p-color-input-border)] bg-[var(--p-color-input-bg-surface)]" />
				</div>
			</div>

			{error != null && !error.showFallback && (
				<Banner tone="critical" onDismiss={() => setError(null)}>
					{error.message}
				</Banner>
			)}

			{error?.showFallback && (
				<Banner tone="warning">
					<p className="text-left">Saku page not found. You can:</p>
					<ul className="mt-2 list-inside list-disc text-left">
						<li>Check the workspace/site format and try again</li>
						<li>Use different handles</li>
						<li>Start with a blank template</li>
					</ul>
				</Banner>
			)}

			<div className="flex flex-col gap-2">
				{error?.showFallback ? (
					<>
						<Button
							variant="primary"
							size="large"
							fullWidth
							onClick={handleContinue}
							disabled={!displayHandle.trim() || isLoading}
							loading={isLoading}
						>
							Try again
						</Button>
						<Button
							variant="secondary"
							size="large"
							fullWidth
							onClick={handleFallbackToTheme}
							disabled={isLoading}
						>
							Start with blank template
						</Button>
					</>
				) : (
					<Button
						variant="primary"
						size="large"
						fullWidth
						onClick={handleContinue}
						disabled={!displayHandle.trim() || isLoading}
						loading={isLoading}
					>
						Continue
					</Button>
				)}

				<Button variant="monochromePlain" onClick={handleBack} disabled={isLoading}>
					Go back
				</Button>
			</div>
		</StepLayout>
	);
};

interface TSakuUrlStepProps {
	onboardingContext: TOnboardingContext;
}
