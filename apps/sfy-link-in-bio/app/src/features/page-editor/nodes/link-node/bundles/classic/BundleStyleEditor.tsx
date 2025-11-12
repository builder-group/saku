import { TClassicLinkNodeBundle, tokenRef } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { AccordionSection } from '@/components';
import { useNodeProperty } from '../../../../hooks';
import { TNodeEditorComponentProps } from '../../../../lib';
import {
	AnimationStyleMixinEditor,
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor,
	ImageStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor,
	TextStyleMixinEditor
} from '../../../../mixins';

export const ClassicBundleStyleEditor: React.FC<
	TNodeEditorComponentProps<TClassicLinkNodeBundle>
> = (props) => {
	const { nodeState, editor } = props;

	const hasThumbnail = useCompute(
		nodeState,
		({ value }) =>
			value.content.metadata?.thumbnail != null || value.content.overrides.thumbnail != null
	);

	const autoLayoutState = useNodeProperty(nodeState, 'autoLayout');
	const appearanceState = useNodeProperty(nodeState, 'appearance');
	const fillState = useNodeProperty(nodeState, 'fill');
	const strokeState = useNodeProperty(nodeState, 'stroke');
	const shadowState = useNodeProperty(nodeState, 'shadow');
	const animationState = useNodeProperty(nodeState, 'animation');
	const textBodyState = useNodeProperty(nodeState, 'textBody');
	const textCaptionState = useNodeProperty(nodeState, 'textCaption');
	const imageState = useNodeProperty(nodeState, 'image');

	return (
		<>
			<AccordionSection title="Layer" collapsibleClassName="px-0 space-y-3" defaultOpen={true}>
				<AutoLayoutStyleMixinEditor
					state={autoLayoutState}
					onLinkToken={() => tokenRef('auto-layout.default', 'auto-layout')}
					editor={editor}
				/>
				<div className="h-px bg-neutral-200" />
				<AppearanceStyleMixinEditor
					state={appearanceState}
					onLinkToken={() => tokenRef('appearance.default', 'appearance')}
					editor={editor}
				/>
				<div className="h-px bg-neutral-200" />
				<FillStyleMixinEditor
					state={fillState}
					onLinkToken={() => tokenRef('fill.default', 'fill')}
					editor={editor}
				/>
				<div className="h-px bg-neutral-200" />
				<StrokeStyleMixinEditor
					state={strokeState}
					onLinkToken={() => tokenRef('stroke.default', 'stroke')}
					editor={editor}
				/>
				<div className="h-px bg-neutral-200" />
				<ShadowStyleMixinEditor
					state={shadowState}
					onLinkToken={() => tokenRef('shadow.default', 'shadow')}
					editor={editor}
				/>
				<div className="h-px bg-neutral-200" />
				<AnimationStyleMixinEditor
					state={animationState}
					onLinkToken={() => tokenRef('animation.default', 'animation')}
					editor={editor}
				/>
			</AccordionSection>
			<AccordionSection title="Title Text" collapsibleClassName="px-0 space-y-3">
				<TextStyleMixinEditor
					state={textBodyState}
					onLinkToken={() => tokenRef('text.body', 'text')}
					editor={editor}
				/>
			</AccordionSection>
			<AccordionSection title="Description Text" collapsibleClassName="px-0 space-y-3">
				<TextStyleMixinEditor
					state={textCaptionState}
					onLinkToken={() => tokenRef('text.caption', 'text')}
					editor={editor}
				/>
			</AccordionSection>
			{hasThumbnail && (
				<AccordionSection title="Thumbnail" collapsibleClassName="px-0 space-y-3">
					<ImageStyleMixinEditor
						state={imageState}
						onLinkToken={() => tokenRef('image.default', 'image')}
						editor={editor}
					/>
				</AccordionSection>
			)}
		</>
	);
};
