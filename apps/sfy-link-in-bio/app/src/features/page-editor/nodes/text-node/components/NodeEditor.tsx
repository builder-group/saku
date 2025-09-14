import { TTextNode } from '@repo/editor';
import { Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { useMapState } from '@/hooks';
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
	const strokeState = useMapState(nodeState, {
		map(baseValue) {
			return baseValue.stroke;
		},
		sync(baseState, mappedValue, notifyOptions) {
			baseState._v.stroke = mappedValue;
			baseState._notify(notifyOptions);
		}
	});
	const shadowState = useMapState(nodeState, {
		map(baseValue) {
			return baseValue.shadow;
		},
		sync(baseState, mappedValue, notifyOptions) {
			baseState._v.shadow = mappedValue;
			baseState._notify(notifyOptions);
		}
	});
	const textState = useMapState(nodeState, {
		map(baseValue) {
			return baseValue.text;
		},
		sync(baseState, mappedValue, notifyOptions) {
			baseState._v.text = mappedValue;
			baseState._notify(notifyOptions);
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleTextChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.text = { type: 'markdown', value };
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
							value={content.text.value}
							onChange={handleTextChange}
							multiline={4}
							autoComplete="off"
							placeholder="Add your text here"
						/>
					</div>
				</div>
			</AccordionSection>

			{/* Design Section */}
			<AccordionSection title="Design" collapsibleClassName="p-0 border-b-0">
				<AccordionSection
					title="Layer"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<AutoLayoutStyleMixinEditor
						state={autoLayoutState}
						tokenSet={editor.mixinTokenMap.autoLayout}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<AppearanceStyleMixinEditor
						state={appearanceState}
						tokenSet={editor.mixinTokenMap.appearance}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<FillStyleMixinEditor
						state={fillState}
						tokenSet={editor.mixinTokenMap.fill}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<StrokeStyleMixinEditor
						state={strokeState}
						tokenSet={editor.mixinTokenMap.stroke}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<ShadowStyleMixinEditor
						state={shadowState}
						tokenSet={editor.mixinTokenMap.shadow}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
				</AccordionSection>
				<AccordionSection
					title="Text"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<TextStyleMixinEditor
						state={textState}
						tokenSet={editor.mixinTokenMap.text}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
				</AccordionSection>
			</AccordionSection>
		</>
	);
};
