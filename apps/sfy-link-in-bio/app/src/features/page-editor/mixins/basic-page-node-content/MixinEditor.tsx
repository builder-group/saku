import { TBasicPageNodeContentMixin } from '@repo/editor';
import { Checkbox, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { cn } from '@/lib';
import { TPageEditor } from '../../lib';

export const BasicPageNodeContentMixinEditor = (props: TBasicPageNodeContentMixinEditorProps) => {
	const { state, className } = props;
	const content = useFeatureState(state);

	// =========================================================================
	// Events
	// =========================================================================

	const handleNavbarVisibleChange = React.useCallback(
		(checked: boolean) => {
			state._v.navbar.visible = checked;
			state._notify();
		},
		[state]
	);

	const handleShareButtonChange = React.useCallback(
		(checked: boolean) => {
			state._v.navbar.shareButtonVisible = checked;
			state._notify();
		},
		[state]
	);

	const handleFooterVisibleChange = React.useCallback(
		(checked: boolean) => {
			state._v.footer.visible = checked;
			state._notify();
		},
		[state]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-4 px-4', className)}>
			{/* Navigation */}
			<div className="space-y-3">
				<Text as="h3" variant="headingSm">
					Navigation
				</Text>

				<div className="space-y-2">
					<Checkbox
						label="Show navbar"
						checked={content.navbar.visible}
						onChange={handleNavbarVisibleChange}
					/>

					{content.navbar.visible && (
						<div className="ml-6 space-y-2">
							<Checkbox
								label="Show share button"
								checked={content.navbar.shareButtonVisible}
								onChange={handleShareButtonChange}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Footer */}
			<div className="space-y-3">
				<Text as="h3" variant="headingSm">
					Footer
				</Text>

				<div className="space-y-2">
					<Checkbox
						label="Show footer"
						checked={content.footer.visible}
						onChange={handleFooterVisibleChange}
					/>
				</div>
			</div>
		</div>
	);
};

interface TBasicPageNodeContentMixinEditorProps {
	state: TState<TBasicPageNodeContentMixin['value'], any>;
	editor: TPageEditor;
	className?: string;
}
