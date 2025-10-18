import { TBasicTextNodeContentMixin } from '@repo/editor';
import { Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { cn } from '@/lib';
import { TPageEditor } from '../../lib';

export const BasicTextNodeContentMixinEditor = (props: TBasicTextNodeContentMixinEditorProps) => {
	const { state, className } = props;
	const content = useFeatureState(state);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTextChange = React.useCallback(
		(value: string) => {
			state._v.text = value;
			state._notify();
		},
		[state]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3 px-4', className)}>
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					Text
				</Text>
				<TextField
					id="text-field"
					label="Text"
					labelHidden
					value={content.text}
					onChange={handleTextChange}
					multiline={4}
					autoComplete="off"
					placeholder="Add your text here"
				/>
			</div>
		</div>
	);
};

interface TBasicTextNodeContentMixinEditorProps {
	state: TState<TBasicTextNodeContentMixin['value'], any>;
	editor: TPageEditor;
	className?: string;
}
