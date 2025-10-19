import { TBasicPageNodeContentMixin } from '@repo/editor';
import { Button, Checkbox, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { PolarisHideIcon, PolarisViewIcon } from '@/components';
import { cn } from '@/lib';
import { TPageEditor } from '../../lib';

export const BasicPageNodeContentMixinEditor = (props: TBasicPageNodeContentMixinEditorProps) => {
	const { state, className } = props;
	const content = useFeatureState(state);

	// =========================================================================
	// Events
	// =========================================================================

	const handleToggleNavbarVisibility = React.useCallback(() => {
		state._v.navbar.visible = !state._v.navbar.visible;
		state._notify();
	}, [state]);

	const handleShareButtonChange = React.useCallback(
		(checked: boolean) => {
			state._v.navbar.shareButtonVisible = checked;
			state._notify();
		},
		[state]
	);

	const handleToggleFooterVisibility = React.useCallback(() => {
		state._v.footer.visible = !state._v.footer.visible;
		state._notify();
	}, [state]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3', className)}>
			{/* Navbar */}
			<div className="space-y-3 px-4">
				<div className="flex items-center justify-between">
					<Text as="span" variant="headingXs" tone="subdued">
						Navbar
					</Text>

					{content.navbar.visible ? (
						<Button
							icon={PolarisViewIcon}
							onClick={handleToggleNavbarVisibility}
							variant="plain"
							size="micro"
						/>
					) : (
						<Button
							icon={PolarisHideIcon}
							onClick={handleToggleNavbarVisibility}
							variant="plain"
							size="micro"
						/>
					)}
				</div>

				<Checkbox
					label="Show share button"
					checked={content.navbar.shareButtonVisible}
					onChange={handleShareButtonChange}
				/>
			</div>

			<div className="h-px bg-neutral-200" />

			{/* Footer */}
			<div className="space-y-3 px-4">
				<div className="flex items-center justify-between">
					<Text as="span" variant="headingXs" tone="subdued">
						Footer
					</Text>

					{content.footer.visible ? (
						<Button
							icon={PolarisViewIcon}
							onClick={handleToggleFooterVisibility}
							variant="plain"
							size="micro"
						/>
					) : (
						<Button
							icon={PolarisHideIcon}
							onClick={handleToggleFooterVisibility}
							variant="plain"
							size="micro"
						/>
					)}
				</div>

				{/* TODO: Add footer links editor */}
			</div>
		</div>
	);
};

interface TBasicPageNodeContentMixinEditorProps {
	state: TState<TBasicPageNodeContentMixin['value'], any>;
	editor: TPageEditor;
	className?: string;
}
