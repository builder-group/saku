import { TFlatPageNode } from '@repo/editor';
import React from 'react';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor
} from '../../../mixins';

export const PageNodeEditor: React.FC<TNodeEditorComponentProps<TFlatPageNode>> = (props) => {
	const { nodeState, editor } = props;

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<AutoLayoutStyleMixinEditor
				state={nodeState}
				mapValue={(value) => value.autoLayout}
				disabledTokenLink
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<AppearanceStyleMixinEditor
				state={nodeState}
				mapValue={(value) => value.appearance}
				disabledTokenLink
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor
				state={nodeState}
				mapValue={(value) => value.fill}
				applyValue={(state, value) => {
					state._v.fill = value;
				}}
				disabledTokenLink
				editor={editor}
			/>
		</>
	);
};
