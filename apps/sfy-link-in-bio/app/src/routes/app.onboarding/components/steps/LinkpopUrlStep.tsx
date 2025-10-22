import { parseUrl } from '@repo/editor';
import { Banner, Button } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { LinkIcon } from '@/components';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

const SUPPORTED_LINKPOP_HOSTNAMES = ['linkpop.com', 'www.linkpop.com'];

export const LinkpopUrlStep: React.FC<TLinkpopUrlStepProps> = (props) => {
	const { onboardingContext } = props;

	const initialHandle = useCompute(onboardingContext.stepr.current, ({ value: currentStep }) => {
		return currentStep.type === 'linkpop-url' && currentStep.handle ? currentStep.handle : '';
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
		if (url == null || !SUPPORTED_LINKPOP_HOSTNAMES.includes(url.hostname.toLowerCase())) {
			return;
		}

		const pathSegments = url.pathname.split('/').filter(Boolean);
		const handle = pathSegments[0];
		if (handle == null) {
			return;
		}

		setDisplayHandle(handle);
		e.preventDefault();
	}, []);

	const handleContinue = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const handle = displayHandle.trim();

		const [isContinueOk, continueErr] = await onboardingContext.continueFromExternalSiteUrl(
			'linkpop',
			`https://linkpop.com/${handle}`
		);
		if (!isContinueOk) {
			const newRetryCount = retryCount + 1;
			setRetryCount(newRetryCount);
			setError({
				message: continueErr.message,
				// Show fallback options after 3 attempts or LinkPop is not found (404)
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
			title="Import from LinkPop"
			description="Enter your LinkPop handle to import your existing page"
			contentClassName="flex flex-col gap-6"
		>
			<div className="flex">
				<div className="flex items-center rounded-l-[var(--p-border-radius-200)] border-y border-l border-[var(--p-color-input-border)] bg-neutral-100 px-3 text-[var(--p-color-text-subdued)]">
					linkpop.com/
				</div>
				<div className="relative flex flex-1 items-center">
					<input
						type="text"
						value={displayHandle}
						onChange={handleChange}
						onPaste={handleUrlPaste}
						placeholder="your-handle"
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
					<p className="text-left">LinkPop page not found. You can:</p>
					<ul className="mt-2 list-inside list-disc text-left">
						<li>Check the handle and try again</li>
						<li>Use a different handle</li>
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

interface TLinkpopUrlStepProps {
	onboardingContext: TOnboardingContext;
}
