import { TClassicProductNodeBundle, tokenRef } from '@repo/editor';
import React from 'react';
import { AccordionSection } from '@/components';
import { useNodeProperty } from '../../../../hooks';
import { TNodeEditorComponentProps } from '../../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	BadgeStyleMixinEditor,
	BannerStyleMixinEditor,
	ButtonStyleMixinEditor,
	FillStyleMixinEditor,
	ImageStyleMixinEditor,
	ProductDetailsStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor,
	TextStyleMixinEditor
} from '../../../../mixins';

export const ClassicBundleStyleEditor: React.FC<
	TNodeEditorComponentProps<TClassicProductNodeBundle>
> = (props) => {
	const { nodeState, editor } = props;

	const autoLayoutState = useNodeProperty(nodeState, 'autoLayout');
	const appearanceState = useNodeProperty(nodeState, 'appearance');
	const fillState = useNodeProperty(nodeState, 'fill');
	const strokeState = useNodeProperty(nodeState, 'stroke');
	const shadowState = useNodeProperty(nodeState, 'shadow');
	const textBodyState = useNodeProperty(nodeState, 'textBody');
	const buttonPrimaryState = useNodeProperty(nodeState, 'buttonPrimary');
	const badgeSecondaryState = useNodeProperty(nodeState, 'badgeSecondary');
	const badgeNeutralState = useNodeProperty(nodeState, 'badgeNeutral');
	const bannerState = useNodeProperty(nodeState, 'banner');
	const imageState = useNodeProperty(nodeState, 'image');
	const productDetailsState = useNodeProperty(nodeState, 'productDetails');

	// =========================================================================
	// UI
	// =========================================================================

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
				title="Product Title"
				collapsibleClassName="px-0 space-y-3"
				size="tight"
				defaultOpen={true}
			>
				<TextStyleMixinEditor
					state={textBodyState}
					onLinkToken={() => tokenRef('text.body', 'text')}
					editor={editor}
				/>
			</AccordionSection>
			<AccordionSection
				title="Buy Button"
				collapsibleClassName="px-0 space-y-3"
				size="tight"
				defaultOpen={true}
			>
				<ButtonStyleMixinEditor
					state={buttonPrimaryState}
					onLinkToken={() => tokenRef('button.primary', 'button')}
					editor={editor}
				/>
			</AccordionSection>
			<AccordionSection
				title="Price Badge"
				collapsibleClassName="px-0 space-y-3"
				size="tight"
				defaultOpen={true}
			>
				<BadgeStyleMixinEditor
					state={badgeSecondaryState}
					onLinkToken={() => tokenRef('badge.secondary', 'badge')}
					editor={editor}
				/>
			</AccordionSection>
			<AccordionSection
				title="Variant Badge"
				collapsibleClassName="px-0 space-y-3"
				size="tight"
				defaultOpen={true}
			>
				<BadgeStyleMixinEditor
					state={badgeNeutralState}
					onLinkToken={() => tokenRef('badge.neutral', 'badge')}
					editor={editor}
				/>
			</AccordionSection>
			<AccordionSection
				title="Banner"
				collapsibleClassName="px-0 space-y-3"
				size="tight"
				defaultOpen={true}
			>
				<BannerStyleMixinEditor
					state={bannerState}
					onLinkToken={() => tokenRef('banner.default', 'banner')}
					editor={editor}
				/>
			</AccordionSection>
			<AccordionSection
				title="Product Image"
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
			<AccordionSection
				title="Product Details Modal"
				collapsibleClassName="px-0 space-y-3"
				size="tight"
				defaultOpen={true}
			>
				<ProductDetailsStyleMixinEditor
					state={productDetailsState}
					onLinkToken={() => tokenRef('product-details.default', 'product-details')}
					editor={editor}
				/>
			</AccordionSection>
		</>
	);
};
