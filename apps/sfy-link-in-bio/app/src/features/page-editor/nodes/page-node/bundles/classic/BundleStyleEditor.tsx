import { TClassicFlatPageNodeBundle } from '@repo/editor';
import React from 'react';
import { AccordionSection } from '@/components';
import { useNodeProperty } from '../../../../hooks';
import { TNodeEditorComponentProps } from '../../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor
} from '../../../../mixins';

export const ClassicBundleStyleEditor: React.FC<
	TNodeEditorComponentProps<TClassicFlatPageNodeBundle>
> = (props) => {
	const { nodeState, editor } = props;

	const autoLayoutState = useNodeProperty(nodeState, 'autoLayout');
	const appearanceState = useNodeProperty(nodeState, 'appearance');
	const fillState = useNodeProperty(nodeState, 'fill');

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<AccordionSection
			title="Layer"
			collapsibleClassName="px-0 space-y-3"
			size="tight"
			defaultOpen={true}
		>
			<AutoLayoutStyleMixinEditor state={autoLayoutState} editor={editor} />
			<div className="h-px bg-neutral-200" />
			<AppearanceStyleMixinEditor state={appearanceState} editor={editor} />
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor state={fillState} syncedTokenLink={false} editor={editor} />
		</AccordionSection>
	);
};
