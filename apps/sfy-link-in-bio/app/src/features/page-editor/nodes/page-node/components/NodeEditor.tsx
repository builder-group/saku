import { TFlatPageNode } from '@repo/editor';
import React from 'react';
import { AccordionSection } from '@/components';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	ChildAppearanceStyleMixinEditor,
	ChildAutoLayoutStyleMixinEditor,
	ChildCtaStyleMixinEditor,
	ChildFillStyleMixinEditor,
	ChildShadowStyleMixinEditor,
	ChildStrokeStyleMixinEditor,
	ChildTextStyleMixinEditor,
	FillStyleMixinEditor
} from '../../../mixins';

export const PageNodeEditor: React.FC<TNodeEditorComponentProps<TFlatPageNode>> = (props) => {
	const { nodeState, editor } = props;

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Page Style Section */}
			<AccordionSection title="Page Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				<AutoLayoutStyleMixinEditor state={nodeState} editor={editor} />
				<div className="h-px bg-gray-200" />
				<AppearanceStyleMixinEditor state={nodeState} editor={editor} />
				<div className="h-px bg-gray-200" />
				<FillStyleMixinEditor state={nodeState} editor={editor} />
				<div className="h-px bg-gray-200" />
			</AccordionSection>

			{/* Child Card Style Section */}
			<AccordionSection title="Card Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				<ChildAutoLayoutStyleMixinEditor state={nodeState} />
				<div className="h-px bg-gray-200" />
				<ChildAppearanceStyleMixinEditor state={nodeState} />
				<div className="h-px bg-gray-200" />
				<ChildFillStyleMixinEditor state={nodeState} editor={editor} />
				<div className="h-px bg-gray-200" />
				<ChildStrokeStyleMixinEditor state={nodeState} />
				<div className="h-px bg-gray-200" />
				<ChildShadowStyleMixinEditor state={nodeState} />
			</AccordionSection>

			{/* Child Text Style Section */}
			<AccordionSection title="Text Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				<ChildTextStyleMixinEditor state={nodeState} editor={editor} />
			</AccordionSection>

			{/* Child CTA Style Section */}
			<AccordionSection title="CTA Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				<ChildCtaStyleMixinEditor state={nodeState} editor={editor} />
			</AccordionSection>
		</>
	);
};
