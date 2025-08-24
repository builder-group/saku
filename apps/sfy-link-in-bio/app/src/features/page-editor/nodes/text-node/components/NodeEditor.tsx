import { TTextNode } from '@repo/editor';
import { Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor,
	TextStyleMixinEditor
} from '../../../mixins';

export const TextNodeEditor: React.FC<TNodeEditorComponentProps<TTextNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTextChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.text = value;
			nodeState._notify();
		},
		[nodeState]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Content Section */}
			<AccordionSection title="Content" defaultOpen={true}>
				<div className="space-y-4">
					{/* Text */}
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
			</AccordionSection>

			{/* Card Style Section */}
			<AccordionSection title="Card Style" collapsibleClassName="px-0 space-y-3">
				<AutoLayoutStyleMixinEditor
					state={nodeState}
					parentState={parentNodeState}
					editor={editor}
				/>
				<div className="h-px bg-gray-200" />
				<AppearanceStyleMixinEditor
					state={nodeState}
					parentState={parentNodeState}
					editor={editor}
				/>
				<div className="h-px bg-gray-200" />
				<FillStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
				<div className="h-px bg-gray-200" />
				<StrokeStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
				<div className="h-px bg-gray-200" />
				<ShadowStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
			</AccordionSection>

			{/* Text Style Section */}
			<AccordionSection title="Text Style" collapsibleClassName="px-0 space-y-3">
				<TextStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
			</AccordionSection>
		</>
	);
};
