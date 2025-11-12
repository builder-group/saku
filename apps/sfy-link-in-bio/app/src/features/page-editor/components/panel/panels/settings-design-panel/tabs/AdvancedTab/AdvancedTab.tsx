import {
	TAnimationStyleMixin,
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TBadgeStyleMixin,
	TBannerStyleMixin,
	TButtonStyleMixin,
	TFillStyleMixin,
	TImageStyleMixin,
	TProductDetailsStyleMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextStyleMixin
} from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { TState } from 'feature-state';
import React from 'react';
import { AccordionSection, CrownIcon, JsonPreview, PersistableBanner } from '@/components';
import { shopifyClientConfig } from '@/environment';
import { useCurrentPlan } from '@/hooks';
import { cn } from '@/lib';
import { TPageEditor } from '../../../../../../lib';
import {
	AnimationStyleMixinEditor,
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
} from '../../../../../../mixins';
import { useTokensByType } from './use-tokens-by-type';

export const AdvancedTab: React.FC<TAdvancedTabProps> = (props) => {
	const { editor } = props;
	const currentPlan = useCurrentPlan();

	const autoLayoutTokens = useTokensByType('auto-layout', editor.tokenMap);
	const appearanceTokens = useTokensByType('appearance', editor.tokenMap);
	// const typographyTokens = useTokensByType(
	// 	'typography',
	// 	editor.tokenMap
	// );
	const fillTokens = useTokensByType('fill', editor.tokenMap);
	const strokeTokens = useTokensByType('stroke', editor.tokenMap);
	const shadowTokens = useTokensByType('shadow', editor.tokenMap);
	const animationTokens = useTokensByType('animation', editor.tokenMap);
	const buttonTokens = useTokensByType('button', editor.tokenMap);
	const badgeTokens = useTokensByType('badge', editor.tokenMap);
	const bannerTokens = useTokensByType('banner', editor.tokenMap);
	const textTokens = useTokensByType('text', editor.tokenMap);
	const imageTokens = useTokensByType('image', editor.tokenMap);
	const productDetailsTokens = useTokensByType('product-details', editor.tokenMap);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div
			className={cn(
				'relative h-full',
				currentPlan.key !== 'awesome' ? 'overflow-y-hidden' : 'overflow-y-auto'
			)}
		>
			<PersistableBanner storageKey="advanced-tab_show-info-banner" tone="info" className="p-2">
				Design tokens are reusable style settings (colors, fonts, spacing) that you can apply to
				multiple elements. Change once, update everywhere!
			</PersistableBanner>

			{/* Auto Layout Section */}
			{autoLayoutTokens.length > 0 && (
				<AccordionSection
					title="Layout"
					collapsibleClassName="p-0 border-b-0"
					// Open by default for free plan users so they can preview the design options through the upgrade overlay
					defaultOpen={currentPlan.key !== 'awesome'}
				>
					{autoLayoutTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<AutoLayoutStyleMixinEditor
								state={state as TState<TAutoLayoutStyleMixin['value'], []>}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Appearance Section */}
			{appearanceTokens.length > 0 && (
				<AccordionSection title="Appearance" collapsibleClassName="p-0 border-b-0">
					{appearanceTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<AppearanceStyleMixinEditor
								state={state as TState<TAppearanceStyleMixin['value'], []>}
								disabledVisibilityToggle
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Fill Section */}
			{fillTokens.length > 0 && (
				<AccordionSection title="Fill" collapsibleClassName="p-0 border-b-0">
					{fillTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<FillStyleMixinEditor
								state={state as TState<TFillStyleMixin['value'], []>}
								syncedTokenLink={false}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Stroke Section */}
			{strokeTokens.length > 0 && (
				<AccordionSection title="Stroke" collapsibleClassName="p-0 border-b-0">
					{strokeTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<StrokeStyleMixinEditor
								state={state as TState<TStrokeStyleMixin['value'], []>}
								syncedTokenLink={false}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Shadow Section */}
			{shadowTokens.length > 0 && (
				<AccordionSection title="Shadow" collapsibleClassName="p-0 border-b-0">
					{shadowTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ShadowStyleMixinEditor
								state={state as TState<TShadowStyleMixin['value'], []>}
								syncedTokenLink={false}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Animation Section */}
			{animationTokens.length > 0 && (
				<AccordionSection title="Animation" collapsibleClassName="p-0 border-b-0">
					{animationTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<AnimationStyleMixinEditor
								state={state as TState<TAnimationStyleMixin['value'], []>}
								syncedTokenLink={false}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Button Section */}
			{buttonTokens.length > 0 && (
				<AccordionSection title="Button" collapsibleClassName="p-0 border-b-0">
					{buttonTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ButtonStyleMixinEditor
								state={state as TState<TButtonStyleMixin['value'], []>}
								syncedTokenLink={false}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Badge Section */}
			{badgeTokens.length > 0 && (
				<AccordionSection title="Badge" collapsibleClassName="p-0 border-b-0">
					{badgeTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<BadgeStyleMixinEditor
								state={state as TState<TBadgeStyleMixin['value'], []>}
								syncedTokenLink={false}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Banner Section */}
			{bannerTokens.length > 0 && (
				<AccordionSection title="Banner" collapsibleClassName="p-0 border-b-0">
					{bannerTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<BannerStyleMixinEditor
								state={state as TState<TBannerStyleMixin['value'], []>}
								syncedTokenLink={false}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Text Section */}
			{textTokens.length > 0 && (
				<AccordionSection title="Text" collapsibleClassName="p-0 border-b-0">
					{textTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<TextStyleMixinEditor
								state={state as TState<TTextStyleMixin['value'], []>}
								syncedTokenLink={false}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Image Section */}
			{imageTokens.length > 0 && (
				<AccordionSection title="Image" collapsibleClassName="p-0 border-b-0">
					{imageTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ImageStyleMixinEditor
								state={state as TState<TImageStyleMixin['value'], []>}
								syncedTokenLink={false}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Product Details Section */}
			{productDetailsTokens.length > 0 && (
				<AccordionSection title="Product Details" collapsibleClassName="p-0 border-b-0">
					{productDetailsTokens.map(({ key, name, state }) => (
						<AccordionSection
							key={key}
							title={name}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ProductDetailsStyleMixinEditor
								state={state as TState<TProductDetailsStyleMixin['value'], []>}
								syncedTokenLink={false}
								disabled={currentPlan.key !== 'awesome'}
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{editor.isDebug() && (
				<AccordionSection title="Debug" collapsibleClassName="px-0 space-y-3">
					<div className="space-y-1 px-4">
						<Text as="span" variant="bodySm" tone="subdued">
							JSON
						</Text>
						<JsonPreview data={editor.tokenMap._v} />
					</div>
				</AccordionSection>
			)}

			{/* Upgrade Overlay */}
			{currentPlan.key !== 'awesome' && (
				<div className="absolute inset-0 z-50 flex h-full items-center justify-center">
					<div
						className="absolute inset-0"
						style={{
							background:
								'linear-gradient(to bottom, transparent 0%, rgba(230,247,255,0.4) 20%, rgba(242,230,255,0.6) 40%, rgba(255,230,240,0.8) 60%, rgba(255,230,240,0.95) 100%)'
						}}
					/>
					<div className="relative z-10 mx-8 max-w-sm text-center">
						<div className="flex flex-col items-center gap-4 rounded-lg bg-white/20 p-6 text-balance backdrop-blur-sm">
							<CrownIcon className="h-6 w-6" />
							<div className="flex flex-col items-center gap-2">
								<Text as="h3" variant="headingMd" fontWeight="semibold" alignment="center">
									Advanced Design Options
								</Text>
								<Text as="p" variant="bodyMd" tone="subdued" alignment="center">
									Want to customize design tokens, advanced styling, and create consistent design
									systems? Upgrade to Awesome plan to unlock powerful design tools.
								</Text>
							</div>
							<Button
								variant="primary"
								size="medium"
								url={`${shopifyClientConfig.shop.adminUrl(editor.shopId)}/settings/plans`}
								target="_blank"
							>
								Upgrade to Awesome
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

interface TAdvancedTabProps {
	editor: TPageEditor;
}
