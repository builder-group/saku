import { TLinkNode, tokenRef } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { AccordionSection } from '@/components';
import { useNodeProperty } from '../../../hooks';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor,
	ImageStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor,
	TextStyleMixinEditor
} from '../../../mixins';

export const LinkNodeStyleEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, editor } = props;

	const hasTextStyle = useCompute(nodeState, ({ value }) => {
		switch (value.content.type) {
			case 'single':
				return true;
			default:
				return false;
		}
	});
	const hasSmTextStyle = useCompute(nodeState, ({ value }) => {
		switch (value.content.type) {
			case 'single':
				return true;
			default:
				return false;
		}
	});
	const imageStyle = useCompute(nodeState, ({ value }) => {
		switch (value.content.type) {
			case 'single':
				return {
					enabled: value.content.favicon != null || value.content.userFavicon != null,
					title: 'Favicon Image'
				};
			case 'youtube-embed':
				return {
					enabled: true,
					title: 'Embed'
				};
			case 'spotify-embed':
				return {
					enabled: true,
					title: 'Embed'
				};
			default:
				return {
					enabled: false,
					title: ''
				};
		}
	});

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

			{hasTextStyle && (
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
			)}
			{hasSmTextStyle && (
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
			)}
			{imageStyle.enabled && (
				<AccordionSection
					title={imageStyle.title}
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
