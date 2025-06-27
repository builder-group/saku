import { Select, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { TTextNode } from '../../../types';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const TextNodeEditor: React.FC<TNodeEditorComponentProps<TTextNode>> = (props) => {
	const { nodeState } = props;
	const node = useFeatureState(nodeState);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTitleChange = React.useCallback(
		(value: string) => {
			if (value === '') {
				nodeState.set((prev) => ({ ...prev, title: undefined }));
			} else {
				nodeState.set((prev) => ({ ...prev, title: value }));
			}
		},
		[nodeState]
	);

	const handleTextChange = React.useCallback(
		(value: string) => {
			nodeState.set((prev) => ({ ...prev, text: value }));
		},
		[nodeState]
	);

	const handleAlignmentChange = React.useCallback(
		(value: TTextNode['alignment']) => {
			nodeState.set((prev) => ({ ...prev, alignment: value }));
		},
		[nodeState]
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
							value={node.title ?? ''}
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
							value={node.text}
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
						value={node.alignment}
						onChange={handleAlignmentChange}
					/>
				</div>
			</AccordionSection>
		</>
	);
};
