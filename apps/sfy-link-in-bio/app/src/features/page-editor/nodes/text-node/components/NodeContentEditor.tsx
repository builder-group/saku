import { TRichContent, TTextNode } from '@repo/editor';
import { Select, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, JsonPreview } from '@/components';
import { TNodeEditorComponentProps } from '../../../lib';

export const TextNodeContentEditor: React.FC<TNodeEditorComponentProps<TTextNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

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
			nodeState._v.content.text = { type: newFormat, value: content.text.value };
			nodeState._notify();
		},
		[nodeState, content.text.value]
	);

	const handleTextChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.text = { type: selectedFormat, value };
			nodeState._notify();
		},
		[nodeState, selectedFormat]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<div className="space-y-4 border-b border-neutral-200 px-4 py-3">
				<div className="space-y-4">
					{/* Format Selector */}
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

			{/* Debug Section */}
			{editor.isDebug() && (
				<AccordionSection title="Debug" collapsibleClassName="px-0 space-y-3">
					<div className="space-y-1 px-4">
						<Text as="span" variant="bodySm" tone="subdued">
							JSON
						</Text>
						<JsonPreview data={nodeState._v} />
					</div>
				</AccordionSection>
			)}
		</>
	);
};
