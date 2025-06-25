import { Select, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { TTextBlock } from '../../../types';
import { TBlockEditorComponentProps } from '../blockEditorsRegistry';

export const TextBlockEditor: React.FC<TBlockEditorComponentProps<TTextBlock>> = (props) => {
	const { blockState } = props;
	const block = useFeatureState(blockState);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTitleChange = React.useCallback(
		(value: string) => {
			if (value === '') {
				blockState.set((prev) => ({ ...prev, title: undefined }));
			} else {
				blockState.set((prev) => ({ ...prev, title: value }));
			}
		},
		[blockState]
	);

	const handleTextChange = React.useCallback(
		(value: string) => {
			blockState.set((prev) => ({ ...prev, text: value }));
		},
		[blockState]
	);

	const handleAlignmentChange = React.useCallback(
		(value: TTextBlock['alignment']) => {
			blockState.set((prev) => ({ ...prev, alignment: value }));
		},
		[blockState]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<AccordionSection title="Content">
				<div className="space-y-4">
					{/* Title */}
					<div className="space-y-1">
						<div>
							<Text as="span" variant="bodySm" tone="subdued">
								Title
							</Text>
						</div>
						<TextField
							id="title-field"
							label="Title"
							labelHidden
							value={block.title ?? ''}
							onChange={handleTitleChange}
							autoComplete="off"
							placeholder="Add your title here"
						/>
					</div>

					{/* Text */}
					<div className="space-y-1">
						<div>
							<Text as="span" variant="bodySm" tone="subdued">
								Text
							</Text>
						</div>
						<TextField
							id="text-field"
							label="Text"
							labelHidden
							value={block.text}
							onChange={handleTextChange}
							multiline={4}
							autoComplete="off"
							placeholder="Add your text here"
						/>
					</div>
				</div>
			</AccordionSection>
			<AccordionSection title="Style">
				{/* Alignment */}
				<div className="space-y-1">
					<div>
						<Text as="span" variant="bodySm" tone="subdued">
							Alignment
						</Text>
					</div>
					<Select
						id="alignment-field"
						label="Alignment"
						labelHidden
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' }
						]}
						value={block.alignment}
						onChange={handleAlignmentChange}
					/>
				</div>
			</AccordionSection>
		</>
	);
};
