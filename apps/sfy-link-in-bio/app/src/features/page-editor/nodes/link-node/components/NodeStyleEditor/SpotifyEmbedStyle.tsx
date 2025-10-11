import { tokenRef, TSpotifyEmbedLinkNodeBundle } from '@repo/editor';
import React from 'react';
import { AccordionSection } from '@/components';
import { useNodeProperty } from '../../../../hooks';
import { TNodeEditorComponentProps } from '../../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor,
	ImageStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor
} from '../../../../mixins';

export const SpotifyEmbedStyleEditor: React.FC<
	TNodeEditorComponentProps<TSpotifyEmbedLinkNodeBundle>
> = (props) => {
	const { nodeState, editor } = props;

	const autoLayoutState = useNodeProperty(nodeState, 'autoLayout');
	const appearanceState = useNodeProperty(nodeState, 'appearance');
	const fillState = useNodeProperty(nodeState, 'fill');
	const strokeState = useNodeProperty(nodeState, 'stroke');
	const shadowState = useNodeProperty(nodeState, 'shadow');
	const imageState = useNodeProperty(nodeState, 'image');

	return (
		<>
			<AccordionSection
				title="Layer"
				collapsibleClassName="px-0 space-y-3"
				size="tight"
				defaultOpen={true}
			>
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
			</AccordionSection>
			<AccordionSection
				title={'Embed'}
				collapsibleClassName="px-0 space-y-3"
				size="tight"
				defaultOpen={true}
			>
				<ImageStyleMixinEditor
					state={imageState}
					onLinkToken={() => tokenRef('image.default', 'image')}
					editor={editor}
				/>
			</AccordionSection>
		</>
	);
};
