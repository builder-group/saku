import { Banner, Button } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { LinkIcon } from '@/components';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const LinkpopUrlStep: React.FC<TLinkpopUrlStepProps> = (props) => {
	const { onboardingContext } = props;

	const initialHandle = useCompute(onboardingContext.stepr.current, (currentStep) => {
		return currentStep.type === 'linkpop-url' && currentStep.handle ? currentStep.handle : '';
	});
	const [handle, setHandle] = React.useState(initialHandle);

	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		// Try to extract handle from full URL if pasted
		try {
			const url = new URL(value);
			if (url.hostname === 'linkpop.com') {
				const pathSegments = url.pathname.split('/').filter(Boolean);
				const newHandle = pathSegments[0]; // First segment is the handle
				if (newHandle) {
					setHandle(newHandle);
					return;
				}
			}
		} catch {
			// Not a valid URL, continue with normal input handling
		}

		// Remove any leading/trailing slashes for direct input
		const newHandle = value.replace(/^\/+|\/+$/g, '');
		setHandle(newHandle);
	}, []);

	const handleContinue = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const result = await onboardingContext.continueFromLinkpopUrl(handle.trim());
		if (result.isErr()) {
			setError(result.error);
			setIsLoading(false);
		}
	}, [onboardingContext, handle]);

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
						value={handle}
						onChange={handleChange}
						placeholder="your-handle"
						className="relative z-20 w-full appearance-none border-none bg-transparent px-3 py-2 leading-[var(--p-font-line-height-500)] text-[var(--p-color-text)] outline-none placeholder:text-[var(--p-color-text-subdued)]"
						autoComplete="off"
						spellCheck="false"
					/>
					<div className="pointer-events-none absolute inset-0 z-10 rounded-r-[var(--p-border-radius-200)] border border-[var(--p-color-input-border)] bg-[var(--p-color-input-bg-surface)]" />
				</div>
			</div>

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
					disabled={!handle.trim() || isLoading}
					loading={isLoading}
				>
					Continue
				</Button>

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
