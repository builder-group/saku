import { TFlatPageNode } from '@repo/editor';
import React from 'react';
import { useMapState } from '@/hooks';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor
} from '../../../mixins';

export const PageNodeEditor: React.FC<TNodeEditorComponentProps<TFlatPageNode>> = (props) => {
	const { nodeState, editor } = props;

	const autoLayoutState = useMapState(nodeState, {
		map(baseValue) {
			return baseValue.autoLayout;
		},
		sync(baseState, mappedValue, notifyOptions) {
			baseState._v.autoLayout = mappedValue;
			baseState._notify(notifyOptions);
		}
	});
	const appearanceState = useMapState(nodeState, {
		map(baseValue) {
			return baseValue.appearance;
		},
		sync(baseState, mappedValue, notifyOptions) {
			baseState._v.appearance = mappedValue;
			baseState._notify(notifyOptions);
		}
	});
	const fillState = useMapState(nodeState, {
		map(baseValue) {
			return baseValue.fill;
		},
		sync(baseState, mappedValue, notifyOptions) {
			baseState._v.fill = mappedValue;
			baseState._notify(notifyOptions);
		}
	});

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
