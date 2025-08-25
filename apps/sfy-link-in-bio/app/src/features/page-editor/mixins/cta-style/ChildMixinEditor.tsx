import { TButtonStyleMixin, TMergeMixins, TUnreference } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { AccordionSection } from '../../../../components';
import { TPageEditor } from '../../lib';
import { ChildAppearanceStyleMixinEditor } from '../appearance-style';
import { ChildFillStyleMixinEditor } from '../fill-style';
import { ChildShadowStyleMixinEditor } from '../shadow-style';
import { ChildStrokeStyleMixinEditor } from '../stroke-style';
import { ChildTextStyleMixinEditor } from '../text-style';

export const ChildCtaStyleMixinEditor = <GValue extends Record<string, any>>(
	props: TChildCtaStyleMixinEditorProps<GValue>
) => {
	const { state, editor } = props;

	const flatState = useMapState(state, {
		get: (parent) => ({ childMixins: parent.childMixins.cta }),
		set: (parent, child, notifyOptions) => {
			parent._v.childMixins.cta = child.childMixins;
			parent._notify(notifyOptions);
		}
	});

	return (
		<>
			<ChildAppearanceStyleMixinEditor state={flatState} />
			<div className="h-px bg-gray-200" />
			<ChildFillStyleMixinEditor state={flatState} editor={editor} />
			<div className="h-px bg-gray-200" />
			<ChildStrokeStyleMixinEditor state={flatState} />
			<div className="h-px bg-gray-200" />
			<ChildShadowStyleMixinEditor state={flatState} />
			<div className="h-px bg-gray-200" />
			<AccordionSection title="Text" defaultOpen collapsibleClassName="px-0 space-y-3">
				<ChildTextStyleMixinEditor state={flatState} editor={editor} />
			</AccordionSection>
		</>
	);
};

interface TChildCtaStyleMixinEditorProps<GValue extends Record<string, any>> {
	state: TState<GValue & { childMixins: TMergeMixins<[TUnreference<TButtonStyleMixin>]> }, any>;
	editor: TPageEditor;
}
