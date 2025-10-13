import { TRichContent, TRichTextNodeContentMixin } from '@repo/editor';
import { Select, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TPageEditor } from '../../lib';

export const RichTextNodeContentMixinEditor = (props: TRichTextNodeContentMixinEditorProps) => {
	const { state, editor } = props;

	const content = useFeatureState(state);

	const [selectedFormat, setSelectedFormat] = React.useState<TRichContent['type']>(
		content.text.type
	);
	const formatOptions = React.useMemo(
		() => [
			{ label: 'Markdown', value: 'markdown' },
			{ label: 'HTML', value: 'html' },
			{ label: 'Plain Text', value: 'text' }
		],
		[]
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleFormatChange = React.useCallback(
		(value: string) => {
			const newFormat = value as TRichContent['type'];
			setSelectedFormat(newFormat);

			// Update the text content with the new format
			state._v.text = { type: newFormat, value: content.text.value };
			state._notify();
		},
		[state, content.text.value]
	);

	const handleTextChange = React.useCallback(
		(value: string) => {
			state._v.text = { type: selectedFormat, value };
			state._notify();
		},
		[state, selectedFormat]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-4 border-b border-neutral-200 px-4 py-3">
			<div className="space-y-4">
				{/* Format */}
				<div className="space-y-1">
					<Text as="span" variant="bodySm" tone="subdued">
						Format
					</Text>
					<Select
						id="text-format-field"
						label="Format"
						labelHidden
						options={formatOptions}
						value={selectedFormat}
						onChange={handleFormatChange}
					/>
				</div>

				{/* Text */}
				<div className="space-y-1">
					<Text as="span" variant="bodySm" tone="subdued">
						Text
					</Text>
					<TextField
						id="text-field"
						label="Text"
						labelHidden
						value={content.text.value}
						onChange={handleTextChange}
						multiline={4}
						autoComplete="off"
						placeholder="Add your text here"
					/>
				</div>
			</div>
		</div>
	);
};

interface TRichTextNodeContentMixinEditorProps {
	state: TState<TRichTextNodeContentMixin['value'], any>;
	editor: TPageEditor;
}
