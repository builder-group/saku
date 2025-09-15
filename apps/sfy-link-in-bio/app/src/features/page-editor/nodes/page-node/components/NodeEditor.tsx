import { TFlatPageNode } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../hooks';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor
} from '../../../mixins';

export const PageNodeEditor: React.FC<TNodeEditorComponentProps<TFlatPageNode>> = (props) => {
	const { nodeState, editor } = props;

	const autoLayoutState = useNodeProperty(nodeState, 'autoLayout');
	const appearanceState = useNodeProperty(nodeState, 'appearance');
	const fillState = useNodeProperty(nodeState, 'fill');

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<AutoLayoutStyleMixinEditor state={autoLayoutState} disabledTokenLink editor={editor} />
			<div className="h-px bg-neutral-200" />
			<AppearanceStyleMixinEditor state={appearanceState} disabledTokenLink editor={editor} />
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor state={fillState} disabledTokenLink editor={editor} />
		</>
	);
};
