import { TFlatPageNode } from '@repo/editor';
import React from 'react';
import { AccordionSection } from '@/components';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	ChildAppearanceStyleMixinEditor,
	ChildFillStyleMixinEditor,
	ChildLayoutStyleMixinEditor,
	ChildTypographyStyleMixinEditor,
	FillStyleMixinEditor,
	PageLayoutStyleMixinEditor
} from '../../../mixins';

export const PageNodeEditor: React.FC<TNodeEditorComponentProps<TFlatPageNode>> = (props) => {
	const { nodeState, editor } = props;

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Style Section */}
			<AccordionSection title="Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				<PageLayoutStyleMixinEditor nodeState={nodeState} />
				<div className="h-px bg-gray-200" />
				{/* <AppearanceStyleMixinEditor nodeState={nodeState} />
				<div className="h-px bg-gray-200" /> */}
				<FillStyleMixinEditor nodeState={nodeState} editor={editor} />
			</AccordionSection>

			{/* Child Style Section */}
			<AccordionSection
				title="Child Style"
				defaultOpen={true}
				collapsibleClassName="px-0 space-y-3"
			>
				<ChildLayoutStyleMixinEditor nodeState={nodeState} />
				<div className="h-px bg-gray-200" />
				<ChildAppearanceStyleMixinEditor nodeState={nodeState} />
				<div className="h-px bg-gray-200" />
				<ChildTypographyStyleMixinEditor nodeState={nodeState} editor={editor} />
				<div className="h-px bg-gray-200" />
				<ChildFillStyleMixinEditor nodeState={nodeState} editor={editor} />
			</AccordionSection>
		</>
	);
};
