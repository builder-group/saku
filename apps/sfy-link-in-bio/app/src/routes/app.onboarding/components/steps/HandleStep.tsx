import { Banner, Button, Tooltip } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { LinkIcon } from '@/components';
import { truncate } from '@/lib';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const HandleStep: React.FC<THandleStepProps> = (props) => {
	const { onboardingContext } = props;

	const initialHandle = useCompute(onboardingContext.stepr.current, (currentStep) => {
		return currentStep.type === 'handle' && currentStep.handle ? currentStep.handle : 'bio';
	});
	const [handle, setHandle] = React.useState(initialHandle);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const isHandleValid = React.useMemo(() => {
		return handle.trim() && handle.length > 0;
	}, [handle]);

	const { text: truncatedShop, isTruncated } = React.useMemo(() => {
		return truncate(onboardingContext.shopId, {
			maxLength: 20,
			mode: 'center'
		});
	}, [onboardingContext.shopId]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		// Remove any leading/trailing slashes and spaces
		const newHandle = e.target.value.replace(/^\/+|\/+$/g, '').trim();
		setHandle(newHandle);
	}, []);

	const handleContinue = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const result = await onboardingContext.continueFromHandle(handle);
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
			title="Choose your page handle"
			description="This will be the URL where your bio page will be accessible"
			contentClassName="flex flex-col gap-6"
		>
			<div className="flex">
				<div className="flex items-center rounded-l-[var(--p-border-radius-200)] border-y border-l border-[var(--p-color-input-border)] bg-neutral-100 px-3 text-[var(--p-color-text-subdued)]">
					{isTruncated ? (
						<Tooltip content={onboardingContext.shopId}>
							<span>{truncatedShop}/</span>
						</Tooltip>
					) : (
						<span>{truncatedShop}/</span>
					)}
				</div>
				<div className="relative flex flex-1 items-center">
					<input
						type="text"
						value={handle}
						onChange={handleChange}
						placeholder="bio"
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
					disabled={!isHandleValid || isLoading}
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

interface THandleStepProps {
	onboardingContext: TOnboardingContext;
}
