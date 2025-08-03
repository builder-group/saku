import { Button, OptionList } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { LayoutListIcon } from '@/components';
import type { TOnboardingContext, TSiteCreationOption } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const SiteCreationOptionsStep: React.FC<TSiteCreationOptionsStepProps> = (props) => {
	const { onboardingContext } = props;

	const initialSelection = useCompute(
		onboardingContext.stepr.current,
		({ value: currentStep }): TSiteCreationOption[] => {
			return currentStep.type === 'site-creation-options' && currentStep.selectedOption
				? [currentStep.selectedOption]
				: ['create-new'];
		},
		[onboardingContext]
	);
	const [selected, setSelected] = React.useState<TSiteCreationOption[]>(initialSelection);

	// =========================================================================
	// Events
	// =========================================================================

	const handleChange = React.useCallback((selectedOptions: string[]) => {
		const option = selectedOptions[0] as TSiteCreationOption;
		setSelected([option]);
	}, []);

	const handleContinue = React.useCallback(() => {
		const option = selected[0];
		if (option == null) {
			return;
		}

		onboardingContext.continueFromSiteCreationOptions(option);
	}, [onboardingContext, selected]);

	const handleBack = React.useCallback(() => {
		onboardingContext.goBack();
	}, [onboardingContext]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<StepLayout
			icon={<LayoutListIcon className="size-4" />}
			title="New site"
			description="Choose how you want to create your site"
			contentClassName="flex flex-col gap-6"
		>
			<OptionList
				onChange={handleChange}
				options={[
					{
						value: 'create-new',
						label: 'Create new site from scratch'
					},
					{
						value: 'linkpop',
						label: 'Import from LinkPop'
					}
				]}
				selected={selected}
			/>

			<div className="flex flex-col gap-2">
				<Button variant="primary" size="large" fullWidth onClick={handleContinue}>
					Continue
				</Button>

				<Button variant="monochromePlain" onClick={handleBack}>
					Go back
				</Button>
			</div>
		</StepLayout>
	);
};

interface TSiteCreationOptionsStepProps {
	onboardingContext: TOnboardingContext;
}
