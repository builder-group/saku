import { TClassicLinkNodeBundle, tokenRef } from '@repo/editor';
import { useCompute } from 'feature-react';
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
	StrokeStyleMixinEditor,
	TextStyleMixinEditor
} from '../../../../mixins';

export const ClassicBundleStyleEditor: React.FC<
	TNodeEditorComponentProps<TClassicLinkNodeBundle>
> = (props) => {
	const { nodeState, editor } = props;

	const hasThumbnail = useCompute(
		nodeState,
		({ value }) => value.content.thumbnail != null || value.content.userThumbnail != null
	);

	const autoLayoutState = useNodeProperty(nodeState, 'autoLayout');
	const appearanceState = useNodeProperty(nodeState, 'appearance');
	const fillState = useNodeProperty(nodeState, 'fill');
	const strokeState = useNodeProperty(nodeState, 'stroke');
	const shadowState = useNodeProperty(nodeState, 'shadow');
	const textState = useNodeProperty(nodeState, 'text');
	const textSmState = useNodeProperty(nodeState, 'textSm');
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
				title="Title Text"
				collapsibleClassName="px-0 space-y-3"
				size="tight"
				defaultOpen={true}
			>
				<TextStyleMixinEditor
					state={textState}
					onLinkToken={() => tokenRef('text.default', 'text')}
					editor={editor}
				/>
			</AccordionSection>

			<AccordionSection
				title="Description Text"
				collapsibleClassName="px-0 space-y-3"
				size="tight"
				defaultOpen={true}
			>
				<TextStyleMixinEditor
					state={textSmState}
					onLinkToken={() => tokenRef('text.sm', 'text')}
					editor={editor}
				/>
			</AccordionSection>

			{hasThumbnail && (
				<AccordionSection
					title="Thumbnail"
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
			)}
		</>
	);
};
