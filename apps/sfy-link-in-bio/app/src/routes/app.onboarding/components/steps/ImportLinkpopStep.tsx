import { Button } from '@shopify/polaris';
import React from 'react';
import { LinkIcon } from '@/components';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const ImportLinkpopStep: React.FC<TImportLinkpopStepProps> = (props) => {
	const { onboardingContext } = props;

	const initialHandle = React.useMemo(() => {
		const currentStep = onboardingContext.stepr.current.get();
		return currentStep.type === 'import-linkpop' && currentStep.handle ? currentStep.handle : '';
	}, [onboardingContext]);

	const [handle, setHandle] = React.useState(initialHandle);

	const handleChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;

			// Try to extract handle from full URL if pasted
			try {
				const url = new URL(value);
				if (url.hostname === 'linkpop.com') {
					const pathSegments = url.pathname.split('/').filter(Boolean);
					const newHandle = pathSegments[0]; // First segment is the handle
					if (newHandle) {
						setHandle(newHandle);
						// Store the handle in the step data
						onboardingContext.stepr.current.set({
							type: 'import-linkpop',
							handle: newHandle
						});
						return;
					}
				}
			} catch {
				// Not a valid URL, continue with normal input handling
			}

			// Remove any leading/trailing slashes for direct input
			const newHandle = value.replace(/^\/+|\/+$/g, '');
			setHandle(newHandle);
			// Store the handle in the step data
			onboardingContext.stepr.current.set({
				type: 'import-linkpop',
				handle: newHandle
			});
		},
		[onboardingContext]
	);

	const handleContinue = React.useCallback(() => {
		if (handle.trim()) {
			const fullUrl = `https://linkpop.com/${handle.trim()}`;
			onboardingContext.stepr.goTo({ type: 'linkpop-preview', url: fullUrl });
		}
	}, [onboardingContext, handle]);

	const handleBack = React.useCallback(() => {
		onboardingContext.stepr.goBack();
	}, [onboardingContext]);

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

			<div className="flex flex-col gap-2">
				<Button
					variant="primary"
					size="large"
					fullWidth
					onClick={handleContinue}
					disabled={!handle.trim()}
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

interface TImportLinkpopStepProps {
	onboardingContext: TOnboardingContext;
}
