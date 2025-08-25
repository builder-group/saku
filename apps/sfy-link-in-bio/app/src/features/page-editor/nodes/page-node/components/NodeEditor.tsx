import { TFlatPageNode } from '@repo/editor';
import React from 'react';
import { AccordionSection } from '@/components';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	ChildAppearanceStyleMixinEditor,
	ChildAutoLayoutStyleMixinEditor,
	ChildButtonStyleMixinEditor,
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
			{/* Page Section */}
			<AccordionSection title="Page" collapsibleClassName="px-0 space-y-3">
				<AutoLayoutStyleMixinEditor state={nodeState} editor={editor} />
				<div className="h-px bg-neutral-200" />
				<AppearanceStyleMixinEditor state={nodeState} editor={editor} />
				<div className="h-px bg-neutral-200" />
				<FillStyleMixinEditor state={nodeState} editor={editor} />
			</AccordionSection>

			{/* Card Section */}
			<AccordionSection title="Card" collapsibleClassName="px-0 space-y-3">
				<ChildAutoLayoutStyleMixinEditor state={nodeState} />
				<div className="h-px bg-neutral-200" />
				<ChildAppearanceStyleMixinEditor state={nodeState} />
				<div className="h-px bg-neutral-200" />
				<ChildFillStyleMixinEditor state={nodeState} editor={editor} />
				<div className="h-px bg-neutral-200" />
				<ChildStrokeStyleMixinEditor state={nodeState} />
				<div className="h-px bg-neutral-200" />
				<ChildShadowStyleMixinEditor state={nodeState} />
			</AccordionSection>

			{/* Text Section */}
			<AccordionSection title="Text" collapsibleClassName="px-0 space-y-3">
				<ChildTextStyleMixinEditor state={nodeState} editor={editor} />
			</AccordionSection>

			{/* CTA Section */}
			<AccordionSection title="Button" collapsibleClassName="px-0 space-y-3">
				<ChildButtonStyleMixinEditor state={nodeState} editor={editor} />
			</AccordionSection>
		</>
	);
};
