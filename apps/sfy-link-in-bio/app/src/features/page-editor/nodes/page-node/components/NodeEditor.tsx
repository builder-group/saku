import { TFlatPageNode } from '@repo/editor';
import React from 'react';
import { AccordionSection } from '@/components';
import { useMapState } from '@/hooks';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor
} from '../../../mixins';

export const PageNodeEditor: React.FC<TNodeEditorComponentProps<TFlatPageNode>> = (props) => {
	const { nodeState, editor } = props;

	// TODO: Figure out how to resuse mixins editors
	const defaultAppearanceToken = useMapState(editor.tokensMap.appearance, {
		map: (token) =>
			token['default'] ?? {
				visible: true,
				opacity: 1,
				borderRadius: 0
			},
		sync: (token, value, notifyOptions) => {
			if (value != null && 'default' in token._v) {
				token._v['default'] = value;
				token._notify(notifyOptions);
			}
		}
	});

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Page Section */}
			<AccordionSection title="Page" collapsibleClassName="px-0 space-y-3">
				<AutoLayoutStyleMixinEditor
					state={nodeState}
					mapValue={(value) => value['autoLayout']}
					tokenSet={editor.tokensMap.autoLayout}
					mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]}
					editor={editor}
				/>
				<div className="h-px bg-neutral-200" />
				<AppearanceStyleMixinEditor
					state={nodeState}
					mapValue={(value) => value['appearance']}
					tokenSet={editor.tokensMap.appearance}
					mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]}
					editor={editor}
				/>
				<div className="h-px bg-neutral-200" />
				<FillStyleMixinEditor
					state={nodeState}
					mapValue={(value) => value.fill}
					applyValue={(state, value) => {
						state._v.fill = value;
					}}
					tokenSet={editor.tokensMap.fill}
					mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]}
					editor={editor}
				/>
			</AccordionSection>

			{/* Card Section */}
			<AccordionSection title="Card" collapsibleClassName="px-0 space-y-3">
				{/* <ChildAutoLayoutStyleMixinEditor state={nodeState} />
				<div className="h-px bg-neutral-200" />
				<ChildAppearanceStyleMixinEditor state={nodeState} />
				<div className="h-px bg-neutral-200" />
				<ChildFillStyleMixinEditor state={nodeState} editor={editor} />
				<div className="h-px bg-neutral-200" />
				<ChildStrokeStyleMixinEditor state={nodeState} />
				<div className="h-px bg-neutral-200" />
				<ChildShadowStyleMixinEditor state={nodeState} /> */}
			</AccordionSection>

			{/* Text Section */}
			<AccordionSection title="Text" collapsibleClassName="px-0 space-y-3">
				{/* <ChildTextStyleMixinEditor state={nodeState} editor={editor} /> */}
			</AccordionSection>

			{/* CTA Section */}
			<AccordionSection title="Button" collapsibleClassName="px-0 space-y-3">
				{/* <ChildButtonStyleMixinEditor state={nodeState} editor={editor} /> */}
			</AccordionSection>
		</>
	);
};
