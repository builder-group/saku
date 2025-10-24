import { TRichContent, TRichTextNodeContentMixin } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { RichContentField } from '@/components';
import { cn } from '@/lib';
import { TPageEditor } from '../../lib';

export const RichTextNodeContentMixinEditor = (props: TRichTextNodeContentMixinEditorProps) => {
	const { state, className } = props;
	const content = useFeatureState(state);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTextChange = React.useCallback(
		(value: TRichContent) => {
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
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Content
				</Text>
			</div>

			{/* Text */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					Text
				</Text>
				<RichContentField
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

interface TRichTextNodeContentMixinEditorProps {
	state: TState<TRichTextNodeContentMixin['value'], any>;
	editor: TPageEditor;
	className?: string;
}
