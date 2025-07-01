import { Button, OptionList } from '@shopify/polaris';
import React from 'react';
import { LayoutListIcon } from '@/components';
import type { TOnboardingContext, TSiteCreationOption } from '../../create-onboarding-context';
import { StepLayout } from '../StepLayout';

export const SiteCreationOptionsStep: React.FC<TSiteCreationOptionsStepProps> = (props) => {
	const { onboardingContext } = props;

	const initialSelection = React.useMemo<TSiteCreationOption[]>(() => {
		const currentStep = onboardingContext.stepr.current.get();
		return currentStep.type === 'site-creation-options' && currentStep.selectedOption
			? [currentStep.selectedOption]
			: ['create-new'];
	}, [onboardingContext]);

	const [selected, setSelected] = React.useState<TSiteCreationOption[]>(initialSelection);

	const handleChange = React.useCallback((selectedOptions: string[]) => {
		const option = selectedOptions[0] as TSiteCreationOption;
		setSelected([option]);
	}, []);

	const handleContinue = React.useCallback(() => {
		const option = selected[0];

		// Store the selection by setting the current step with the selection
		onboardingContext.stepr.current.set({
			type: 'site-creation-options',
			selectedOption: option
		});

		switch (option) {
			case 'create-new':
				onboardingContext.stepr.goTo({ type: 'templates' });
				break;
			case 'import-linkpop':
				onboardingContext.stepr.goTo({ type: 'import-linkpop' });
				break;
		}
	}, [onboardingContext, selected]);

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
						value: 'import-linkpop',
						label: 'Import from LinkPop'
					}
				]}
				selected={selected}
			/>

			<Button variant="primary" size="large" fullWidth onClick={handleContinue}>
				Continue
			</Button>
		</StepLayout>
	);
};

interface TSiteCreationOptionsStepProps {
	onboardingContext: TOnboardingContext;
}
