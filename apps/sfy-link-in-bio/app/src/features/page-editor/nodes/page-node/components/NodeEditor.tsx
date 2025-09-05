import {
	isTokenRef,
	TAppearanceStyleToken,
	TAutoLayoutStyleToken,
	TButtonStyleToken,
	TFillStyleToken,
	TFlatPageNode,
	TShadowStyleToken,
	TStrokeStyleToken,
	TTextStyleToken
} from '@repo/editor';
import React from 'react';
import { AccordionSection } from '@/components';
import { useMapState } from '@/hooks';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	ButtonStyleMixinEditor,
	FillStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor,
	TextStyleMixinEditor
} from '../../../mixins';

export const PageNodeEditor: React.FC<TNodeEditorComponentProps<TFlatPageNode>> = (props) => {
	const { nodeState, editor } = props;

	const defaultAppearanceToken = useMapState(editor.mixinTokenMap.appearance, {
		map: (token) =>
			token['default'] !== undefined
				? token['default'].value
				: ({
						visible: true,
						opacity: 1,
						borderRadius: 0
					} satisfies TAppearanceStyleToken['value']),
		sync: (token, value, notifyOptions) => {
			const tokenDefault = token._v['default'];
			if (tokenDefault != null) {
				tokenDefault.value = value;
				token._notify(notifyOptions);
			}
		}
	});
	const defaultAutoLayoutToken = useMapState(editor.mixinTokenMap.autoLayout, {
		map: (token) =>
			token['default'] !== undefined
				? token['default'].value
				: ({
						horizontalPadding: 0,
						verticalPadding: 0,
						horizontalGap: undefined,
						verticalGap: undefined
					} satisfies TAutoLayoutStyleToken['value']),
		sync: (token, value, notifyOptions) => {
			const tokenDefault = token._v['default'];
			if (tokenDefault != null) {
				tokenDefault.value = value;
				token._notify(notifyOptions);
			}
		}
	});
	const defaultFillToken = useMapState(editor.mixinTokenMap.fill, {
		map: (token) =>
			token['default'] !== undefined
				? token['default'].value
				: ({
						paint: {
							type: 'solid',
							color: { r: 0, g: 0, b: 0, a: 1 }
						},
						opacity: 1
					} satisfies TFillStyleToken['value']),
		sync: (token, value, notifyOptions) => {
			const tokenDefault = token._v['default'];
			if (tokenDefault != null) {
				tokenDefault.value = value;
				token._notify(notifyOptions);
			}
		}
	});
	const defaultStrokeToken = useMapState(editor.mixinTokenMap.stroke, {
		map: (token) =>
			token['default'] !== undefined
				? token['default'].value
				: ({ color: { r: 0, g: 0, b: 0, a: 0.1 }, width: 1 } satisfies TStrokeStyleToken['value']),
		sync: (token, value, notifyOptions) => {
			const tokenDefault = token._v['default'];
			if (tokenDefault != null) {
				tokenDefault.value = value;
				token._notify(notifyOptions);
			}
		}
	});
	const defaultShadowToken = useMapState(editor.mixinTokenMap.shadow, {
		map: (token) =>
			token['default'] !== undefined
				? token['default'].value
				: ({
						color: { r: 0, g: 0, b: 0, a: 0.1 },
						offsetX: 0,
						offsetY: 4,
						blur: 6,
						spread: -1
					} satisfies TShadowStyleToken['value']),
		sync: (token, value, notifyOptions) => {
			const tokenDefault = token._v['default'];
			if (tokenDefault != null) {
				tokenDefault.value = value;
				token._notify(notifyOptions);
			}
		}
	});
	const defaultTextToken = useMapState(editor.mixinTokenMap.text, {
		map: (token) =>
			token['default'] !== undefined
				? token['default'].value
				: ({
						appearance: { visible: true, opacity: 1, borderRadius: 0 },
						typography: {
							font: { family: 'Inter', weight: 400, style: 'normal' },
							fontSize: 16,
							textAlignHorizontal: 'center',
							textAlignVertical: 'center',
							lineHeight: { type: 'auto' },
							letterSpacing: { type: 'auto' }
						},
						fill: {
							paint: {
								type: 'solid',
								color: { r: 0, g: 0, b: 0, a: 1 }
							},
							opacity: 1
						},
						stroke: null,
						shadow: null
					} satisfies TTextStyleToken['value']),
		sync: (token, value, notifyOptions) => {
			const tokenDefault = token._v['default'];
			if (tokenDefault != null) {
				tokenDefault.value = value;
				token._notify(notifyOptions);
			}
		}
	});
	const defaultButtonToken = useMapState(editor.mixinTokenMap.button, {
		map: (token) =>
			token['default'] !== undefined
				? token['default'].value
				: ({
						appearance: { visible: true, opacity: 1, borderRadius: 0 },
						fill: {
							paint: {
								type: 'solid',
								color: { r: 0, g: 0, b: 0, a: 1 }
							},
							opacity: 1
						},
						stroke: null,
						shadow: null,
						text: {
							appearance: { visible: true, opacity: 1, borderRadius: 0 },
							typography: {
								font: { family: 'Inter', weight: 400, style: 'normal' },
								fontSize: 16,
								textAlignHorizontal: 'center',
								textAlignVertical: 'center',
								lineHeight: { type: 'auto' },
								letterSpacing: { type: 'auto' }
							},
							fill: {
								paint: {
									type: 'solid',
									color: { r: 255, g: 255, b: 255, a: 1 }
								},
								opacity: 1
							},
							stroke: null,
							shadow: null
						}
					} satisfies TButtonStyleToken['value']),
		sync: (token, value, notifyOptions) => {
			const tokenDefault = token._v['default'];
			if (tokenDefault != null) {
				tokenDefault.value = value;
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
			</AccordionSection>

			{/* Layer Section */}
			<AccordionSection title="Layer" collapsibleClassName="px-0 space-y-3">
				{defaultAutoLayoutToken && (
					<AutoLayoutStyleMixinEditor
						state={defaultAutoLayoutToken}
						mapValue={(value) => value}
						disabledTokenLink
						editor={editor}
					/>
				)}
				{defaultAppearanceToken && (
					<>
						<div className="h-px bg-neutral-200" />
						<AppearanceStyleMixinEditor
							state={defaultAppearanceToken}
							mapValue={(value) => value}
							disabledTokenLink
							disabledVisibilityToggle
							editor={editor}
						/>
					</>
				)}
				{defaultFillToken && (
					<>
						<div className="h-px bg-neutral-200" />
						<FillStyleMixinEditor
							state={defaultFillToken}
							mapValue={(value) => value}
							applyValue={(state, value) => {
								if (!isTokenRef(value)) {
									state._v = value;
								}
							}}
							disabledTokenLink
							editor={editor}
						/>
					</>
				)}
				{defaultStrokeToken && (
					<>
						<div className="h-px bg-neutral-200" />
						<StrokeStyleMixinEditor
							state={defaultStrokeToken}
							mapValue={(value) => value}
							applyValue={(state, value) => {
								if (!isTokenRef(value)) {
									state._v = value;
								}
							}}
							disabledTokenLink
							editor={editor}
						/>
					</>
				)}
				{defaultShadowToken && (
					<>
						<div className="h-px bg-neutral-200" />
						<ShadowStyleMixinEditor
							state={defaultShadowToken}
							mapValue={(value) => value}
							applyValue={(state, value) => {
								if (!isTokenRef(value)) {
									state._v = value;
								}
							}}
							disabledTokenLink
							editor={editor}
						/>
					</>
				)}
			</AccordionSection>

			{/* Text Section */}
			{defaultTextToken && (
				<AccordionSection title="Text" collapsibleClassName="px-0 space-y-3">
					<TextStyleMixinEditor
						state={defaultTextToken}
						mapValue={(value) => value}
						disabledTokenLink
						editor={editor}
					/>
				</AccordionSection>
			)}

			{/* CTA Section */}
			{defaultButtonToken && (
				<AccordionSection title="Button" collapsibleClassName="px-0 space-y-3">
					<ButtonStyleMixinEditor
						state={defaultButtonToken}
						mapValue={(value) => value}
						disabledTokenLink
						editor={editor}
					/>
				</AccordionSection>
			)}
		</>
	);
};
