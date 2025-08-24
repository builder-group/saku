import { TFlatPageNode } from '@repo/editor';
import React from 'react';
import { AccordionSection } from '@/components';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	ChildCardStyleMixinEditor,
	ChildCtaStyleMixinEditor,
	ChildTextStyleMixinEditor,
	PageStyleMixinEditor
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
				<PageStyleMixinEditor state={nodeState} editor={editor} />
			</AccordionSection>

			{/* Child Card Style Section */}
			<AccordionSection title="Card Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				<ChildCardStyleMixinEditor state={nodeState} editor={editor} />
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
