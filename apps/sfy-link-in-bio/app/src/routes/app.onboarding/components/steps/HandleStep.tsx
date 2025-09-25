import { Banner, Button, Tooltip } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { LinkIcon } from '@/components';
import { truncate } from '@/lib';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const HandleStep: React.FC<THandleStepProps> = (props) => {
	const { onboardingContext } = props;

	const initialHandle = useCompute(onboardingContext.stepr.current, ({ value: currentStep }) => {
		return currentStep.type === 'handle' && currentStep.handle
			? currentStep.handle
			: onboardingContext.defaultHandle.handle;
	});
	const [handle, setHandle] = React.useState(initialHandle);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<{
		message: string;
		canOverrideRedirect: boolean;
	} | null>(null);

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
		setError(null);
	}, []);

	const handleContinue = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const result = await onboardingContext.continueFromHandle(handle);
		if (result.isErr()) {
			setError({
				message: result.error.message,
				canOverrideRedirect: result.error.canOverrideRedirect
			});
			setIsLoading(false);
		}
	}, [onboardingContext, handle]);

	const handleOverrideRedirect = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const result = await onboardingContext.continueFromHandle(handle, { override: true });
		if (result.isErr()) {
			setError({
				message: result.error.message,
				canOverrideRedirect: false
			});
			setIsLoading(false);
		}
	}, [onboardingContext, handle]);

	const handleChooseDifferent = React.useCallback(() => {
		const randomNum = Math.floor(Math.random() * 99) + 1;
		setHandle(`${handle}${randomNum}`);
		setError(null);
	}, [handle]);

	const handleBack = React.useCallback(() => {
		onboardingContext.goBack();
	}, [onboardingContext]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<StepLayout
			icon={<LinkIcon className="size-4" />}
			title="Choose page handle"
			description="This will be the URL path for your bio page"
			contentClassName="flex flex-col gap-6"
		>
			<div className="flex flex-row">
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
						placeholder={onboardingContext.defaultHandle.handle}
						className="relative z-20 w-full appearance-none border-none bg-transparent px-3 py-2 leading-[var(--p-font-line-height-500)] text-[var(--p-color-text)] outline-none placeholder:text-[var(--p-color-text-subdued)]"
						autoComplete="off"
						spellCheck="false"
					/>
					<div className="pointer-events-none absolute inset-0 z-10 rounded-r-[var(--p-border-radius-200)] border border-[var(--p-color-input-border)] bg-[var(--p-color-input-bg-surface)]" />
				</div>
			</div>

			{error != null && !error.canOverrideRedirect && (
				<Banner tone="critical" onDismiss={() => setError(null)}>
					{error.message}
				</Banner>
			)}

			{error?.canOverrideRedirect && (
				<Banner tone="warning">
					<p className="text-left">This URL is already in use. You can:</p>
					<ul className="mt-2 list-inside list-disc text-left">
						<li>Choose a different handle</li>
						<li>Override the existing URL redirect</li>
					</ul>
				</Banner>
			)}

			<div className="flex flex-col gap-2">
				{error?.canOverrideRedirect ? (
					<>
						<Button
							variant="primary"
							size="large"
							fullWidth
							onClick={handleOverrideRedirect}
							disabled={!isHandleValid || isLoading}
							loading={isLoading}
							tone="critical"
						>
							Override existing URL
						</Button>
						<Button
							variant="secondary"
							size="large"
							fullWidth
							onClick={handleChooseDifferent}
							disabled={isLoading}
						>
							Choose different handle
						</Button>
					</>
				) : (
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
				)}

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
