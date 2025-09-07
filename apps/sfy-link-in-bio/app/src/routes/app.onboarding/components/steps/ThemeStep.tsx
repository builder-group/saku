import { themes, TTheme } from '@repo/editor';
import { Banner, Button } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { LayoutTemplateIcon } from '@/components';
import { ThemeIcon, ThemePreview } from '@/features/page-editor/components/display';
import type { TOnboardingContext } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const ThemeStep: React.FC<TThemeStepProps> = (props) => {
	const { onboardingContext } = props;
	const navigate = useNavigate();

	const initialSelection = useCompute(
		onboardingContext.stepr.current,
		({ value: currentStep }): TTheme => {
			return currentStep.type === 'theme' && currentStep.selectedTheme
				? currentStep.selectedTheme
				: (themes[0] as TTheme); // Default to first theme
		},
		[]
	);
	const [selectedTheme, setSelectedTheme] = React.useState<TTheme>(initialSelection);

	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	// =========================================================================
	// Events
	// =========================================================================

	const handleThemeSelect = React.useCallback((theme: TTheme) => {
		setSelectedTheme(theme);
		setError(null);
	}, []);

	const handleContinue = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const result = await onboardingContext.continueFromTheme(selectedTheme);
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
	}, [onboardingContext, selectedTheme, navigate]);

	const handleBack = React.useCallback(() => {
		onboardingContext.goBack();
	}, [onboardingContext]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<StepLayout
			icon={<LayoutTemplateIcon className="size-4" />}
			title="Choose a theme"
			description="Select a theme that matches your brand and style"
			contentClassName="flex flex-col gap-6"
		>
			{/* Theme Selection Grid */}
			<div className="relative left-1/2 grid max-h-96 w-[640px] -translate-x-1/2 grid-cols-3 gap-3 overflow-y-auto p-1">
				{themes.map((theme) => {
					const isSelected = selectedTheme.key === theme.key;

					return (
						<div
							key={theme.key}
							className={`group cursor-pointer rounded-lg border p-3 transition-all hover:shadow-sm ${
								isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
							}`}
							onClick={() => handleThemeSelect(theme)}
						>
							{/* Header with colors, name, and selection indicator */}
							<div className="mb-3 flex items-center gap-2">
								<ThemeIcon theme={theme} />

								<div className="flex-1 text-left">
									<p className="text-sm font-medium text-gray-900">{theme.name}</p>
								</div>

								{/* Selection indicator */}
								{isSelected && (
									<div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
										<div className="h-2 w-2 rounded-full bg-white" />
									</div>
								)}
							</div>

							{/* Preview */}
							<ThemePreview theme={theme} />
						</div>
					);
				})}
			</div>

			<Banner tone="info">You can always change your theme later in the editor settings.</Banner>

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
					Continue to editor
				</Button>

				<Button variant="monochromePlain" onClick={handleBack} disabled={isLoading}>
					Go back
				</Button>
			</div>
		</StepLayout>
	);
};

interface TThemeStepProps {
	onboardingContext: TOnboardingContext;
}
