import { useNavigate } from '@remix-run/react';
import { Banner, Button, OptionList } from '@shopify/polaris';
import React from 'react';
import { LayoutTemplateIcon } from '@/components';
import type { TOnboardingContext, TTemplate } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const TemplatesStep: React.FC<TTemplatesStepProps> = (props) => {
	const { onboardingContext } = props;
	const navigate = useNavigate();

	const initialSelection = React.useMemo<TTemplate[]>(() => {
		const currentStep = onboardingContext.stepr.current.get();
		return currentStep.type === 'templates' && currentStep.selectedTemplate
			? [currentStep.selectedTemplate]
			: ['blank'];
	}, [onboardingContext]);
	const [selected, setSelected] = React.useState<TTemplate[]>(initialSelection);

	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback((selectedOptions: string[]) => {
		const option = selectedOptions[0] as TTemplate;
		setSelected([option]);
		setError(null);
	}, []);

	const handleContinue = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const selectedTemplate = selected[0];
		if (selectedTemplate == null) {
			setError('Please select a template');
			setIsLoading(false);
			return;
		}

		const result = await onboardingContext.continueFromTemplates(selectedTemplate);
		if (result.isErr()) {
			setError(result.error);
			setIsLoading(false);
			return;
		}

		navigate('/app?openEditor=true', {
			replace: true, // To prevent back navigation
			state: { fromOnboarding: true }
		});
	}, [onboardingContext, selected, navigate]);

	const handleBack = React.useCallback(() => {
		onboardingContext.goBack();
	}, [onboardingContext]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<StepLayout
			icon={<LayoutTemplateIcon className="size-4" />}
			title="Choose a template"
			description="Start with a template or begin with a blank canvas"
			contentClassName="flex flex-col gap-6"
		>
			<div className="flex flex-col gap-2">
				<OptionList
					onChange={handleChange}
					options={[
						{
							value: 'blank',
							label: 'Blank template',
							id: 'blank'
						}
					]}
					selected={selected}
				/>

				<Banner tone="info">
					More templates are coming soon to help you create beautiful bio pages faster.
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
		</StepLayout>
	);
};

interface TTemplatesStepProps {
	onboardingContext: TOnboardingContext;
}
