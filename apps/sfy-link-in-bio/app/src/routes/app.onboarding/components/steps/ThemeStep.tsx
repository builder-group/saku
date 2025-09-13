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
			className="h-screen overflow-y-auto"
			contentClassName="flex flex-col items-center gap-6 min-h-0 max-w-xl"
		>
			<div className="max-h-96 min-h-48 flex-1 overflow-y-auto">
				<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
					{themes.map((theme) => {
						const isSelected = selectedTheme.key === theme.key;

						return (
							<div
								key={theme.key}
								className={`group cursor-pointer rounded-lg border p-3 transition-all hover:shadow-sm ${
									isSelected
										? 'border-blue-500 bg-blue-50'
										: 'border-gray-200 hover:border-gray-300'
								}`}
								onClick={() => handleThemeSelect(theme)}
							>
								<div className="mb-3 flex items-center gap-2">
									<ThemeIcon theme={theme} />
									<div className="flex-1 text-left">
										<p className="text-sm font-medium text-gray-900">{theme.name}</p>
									</div>
									{isSelected && (
										<div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
											<div className="h-2 w-2 rounded-full bg-white" />
										</div>
									)}
								</div>
								<ThemePreview theme={theme} />
							</div>
						);
					})}
				</div>
			</div>

			<div className="flex w-full max-w-sm flex-col gap-4">
				<div className="hidden md:block">
					<Banner tone="info">
						You can always change your theme later in the editor settings.
					</Banner>
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
						loading={isLoading}
						disabled={isLoading}
					>
						Continue to editor
					</Button>

					<Button variant="monochromePlain" onClick={handleBack} disabled={isLoading}>
						Go back
					</Button>
				</div>
			</div>
		</StepLayout>
	);
};

interface TThemeStepProps {
	onboardingContext: TOnboardingContext;
}
