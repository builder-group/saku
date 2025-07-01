import { Banner, Button, OptionList } from '@shopify/polaris';
import React from 'react';
import { LayoutTemplateIcon } from '@/components';
import type { TOnboardingContext, TTemplate } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const TemplatesStep: React.FC<TTemplatesStepProps> = (props) => {
	const { onboardingContext } = props;

	const initialSelection = React.useMemo<TTemplate[]>(() => {
		const currentStep = onboardingContext.stepr.current.get();
		return currentStep.type === 'templates' && currentStep.selectedTemplate
			? [currentStep.selectedTemplate]
			: ['blank'];
	}, [onboardingContext]);

	const [selected, setSelected] = React.useState<TTemplate[]>(initialSelection);

	const handleChange = React.useCallback((selectedOptions: string[]) => {
		const option = selectedOptions[0] as TTemplate;
		setSelected([option]);
	}, []);

	const handleContinue = React.useCallback(() => {
		const template = selected[0];

		// Store the selection
		onboardingContext.stepr.current.set({
			type: 'templates',
			selectedTemplate: template
		});

		// TODO: Navigate to editor with selected template
	}, [onboardingContext, selected]);

	const handleBack = React.useCallback(() => {
		onboardingContext.stepr.goBack();
	}, [onboardingContext]);

	return (
		<StepLayout
			icon={<LayoutTemplateIcon className="size-4" />}
			title="Choose template"
			description="Start with a template or begin from scratch"
			contentClassName="flex flex-col gap-6"
		>
			<div className="flex flex-col gap-2">
				<OptionList
					onChange={handleChange}
					options={[
						{
							value: 'blank',
							label: 'Blank template'
						}
					]}
					selected={selected}
				/>

				<Banner tone="info">
					More templates are coming soon to help you create beautiful bio pages faster.
				</Banner>
			</div>

			<div className="flex flex-col gap-2">
				<Button variant="primary" size="large" fullWidth onClick={handleContinue}>
					Continue to editor
				</Button>

				<Button variant="monochromePlain" onClick={handleBack}>
					Go back
				</Button>
			</div>
		</StepLayout>
	);
};

interface TTemplatesStepProps {
	onboardingContext: TOnboardingContext;
}
