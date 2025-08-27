import { TButtonStyleMixin, TMergeMixins } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import { TPageEditor } from '../../lib';
import { AppearanceStyleMixinEditor } from '../appearance-style';
import { FillStyleMixinEditor } from '../fill-style';
import { ShadowStyleMixinEditor } from '../shadow-style';
import { StrokeStyleMixinEditor } from '../stroke-style';
import { TextStyleMixinEditor } from '../text-style';

export const ButtonStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TButtonStyleMixinEditorProps<GValue>
) => {
	const { state, editor } = props;

	return (
		<>
			<AppearanceStyleMixinEditor
				state={state}
				mapValue={(value) => value.button.appearance}
				tokenSet={editor.tokensMap.button}
				mapToken={(token) => token?.appearance}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<FillStyleMixinEditor
				state={state}
				mapValue={(value) => value.button.fill}
				applyValue={(state, value) => {
					state._v.button.fill = value;
				}}
				tokenSet={editor.tokensMap.button}
				mapToken={(token) => token?.fill}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<StrokeStyleMixinEditor
				state={state}
				mapValue={(value) => value.button.stroke}
				applyValue={(state, value) => {
					state._v.button.stroke = value;
				}}
				tokenSet={editor.tokensMap.button}
				mapToken={(token) => token?.stroke}
				editor={editor}
			/>
			<div className="h-px bg-neutral-200" />
			<ShadowStyleMixinEditor
				state={state}
				mapValue={(value) => value.button.shadow}
				applyValue={(state, value) => {
					state._v.button.shadow = value;
				}}
				tokenSet={editor.tokensMap.button}
				mapToken={(token) => token?.shadow}
				editor={editor}
				disabledSpread
			/>
			<div className="border-t border-b border-neutral-200 bg-neutral-50 px-4 py-1">
				<Text as="span" variant="headingXs">
					Text
				</Text>
			</div>
			<TextStyleMixinEditor state={state} editor={editor} />
		</>
	);
};

interface TButtonStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & TMergeMixins<[TButtonStyleMixin]>, any>;
	editor: TPageEditor;
}
