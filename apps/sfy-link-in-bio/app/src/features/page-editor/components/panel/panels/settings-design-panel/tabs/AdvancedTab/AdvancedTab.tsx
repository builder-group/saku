import {
	isTokenRef,
	TAppearanceStyleToken,
	TAutoLayoutStyleToken,
	TBadgeStyleToken,
	TButtonStyleToken,
	TFillStyleToken,
	TImageStyleToken,
	TProductDetailsStyleToken,
	TShadowStyleToken,
	TStrokeStyleToken,
	TTextStyleToken,
	TTypographyStyleToken
} from '@repo/editor';
import React from 'react';
import { AccordionSection } from '@/components';
import { TPageEditor } from '../../../../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	BadgeStyleMixinEditor,
	ButtonStyleMixinEditor,
	FillStyleMixinEditor,
	ImageStyleMixinEditor,
	ProductDetailsStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor,
	TextStyleMixinEditor,
	TypographyStyleMixinEditor
} from '../../../../../../mixins';
import { PageNodeEditor } from '../../../../../../nodes';
import { useMixinTokens } from './use-mixin-tokens';

export const AdvancedTab: React.FC<TAdvancedTabProps> = (props) => {
	const { editor } = props;

	// Dynamic mixin tokens using helper hook
	const autoLayoutTokens = useMixinTokens<TAutoLayoutStyleToken['value']>(
		editor.mixinTokenMap.autoLayout
	);
	const appearanceTokens = useMixinTokens<TAppearanceStyleToken['value']>(
		editor.mixinTokenMap.appearance
	);
	const typographyTokens = useMixinTokens<TTypographyStyleToken['value']>(
		editor.mixinTokenMap.typography
	);
	const fillTokens = useMixinTokens<TFillStyleToken['value']>(editor.mixinTokenMap.fill);
	const strokeTokens = useMixinTokens<TStrokeStyleToken['value']>(editor.mixinTokenMap.stroke);
	const shadowTokens = useMixinTokens<TShadowStyleToken['value']>(editor.mixinTokenMap.shadow);
	const buttonTokens = useMixinTokens<TButtonStyleToken['value']>(editor.mixinTokenMap.button);
	const badgeTokens = useMixinTokens<TBadgeStyleToken['value']>(editor.mixinTokenMap.badge);
	const textTokens = useMixinTokens<TTextStyleToken['value']>(editor.mixinTokenMap.text);
	const imageTokens = useMixinTokens<TImageStyleToken['value']>(editor.mixinTokenMap.image);
	const productDetailsTokens = useMixinTokens<TProductDetailsStyleToken['value']>(
		editor.mixinTokenMap.productDetails
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Page Section */}
			<AccordionSection title="Page" collapsibleClassName="px-0 space-y-3" defaultOpen={true}>
				<PageNodeEditor nodeState={editor.getRootNode()} editor={editor} />
			</AccordionSection>

			{/* Auto Layout Variants Section */}
			{autoLayoutTokens.length > 0 && (
				<AccordionSection title="Auto Layout Variants" collapsibleClassName="p-0 border-b-0">
					{autoLayoutTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Auto Layout`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<AutoLayoutStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Appearance Variants Section */}
			{appearanceTokens.length > 0 && (
				<AccordionSection title="Appearance Variants" collapsibleClassName="p-0 border-b-0">
					{appearanceTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Appearance`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<AppearanceStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Typography Variants Section */}
			{typographyTokens.length > 0 && (
				<AccordionSection title="Typography Variants" collapsibleClassName="p-0 border-b-0">
					{typographyTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Typography`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<TypographyStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								applyValue={(state, value) => {
									state._v = value;
								}}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Fill Variants Section */}
			{fillTokens.length > 0 && (
				<AccordionSection title="Fill Variants" collapsibleClassName="p-0 border-b-0">
					{fillTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Fill`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<FillStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								applyValue={(state, value) => {
									if (!isTokenRef(value)) {
										state._v = value;
									}
								}}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Stroke Variants Section */}
			{strokeTokens.length > 0 && (
				<AccordionSection title="Stroke Variants" collapsibleClassName="p-0 border-b-0">
					{strokeTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Stroke`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<StrokeStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								applyValue={(state, value) => {
									if (!isTokenRef(value)) {
										state._v = value;
									}
								}}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Shadow Variants Section */}
			{shadowTokens.length > 0 && (
				<AccordionSection title="Shadow Variants" collapsibleClassName="p-0 border-b-0">
					{shadowTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Shadow`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ShadowStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								applyValue={(state, value) => {
									if (!isTokenRef(value)) {
										state._v = value;
									}
								}}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Button Variants Section */}
			{buttonTokens.length > 0 && (
				<AccordionSection title="Button Variants" collapsibleClassName="p-0 border-b-0">
					{buttonTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Button`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ButtonStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Badge Variants Section */}
			{badgeTokens.length > 0 && (
				<AccordionSection title="Badge Variants" collapsibleClassName="p-0 border-b-0">
					{badgeTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Badge`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<BadgeStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Text Variants Section */}
			{textTokens.length > 0 && (
				<AccordionSection title="Text Variants" collapsibleClassName="p-0 border-b-0">
					{textTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Text`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<TextStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Image Variants Section */}
			{imageTokens.length > 0 && (
				<AccordionSection title="Image Variants" collapsibleClassName="p-0 border-b-0">
					{imageTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Image`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ImageStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Product Details Variants Section */}
			{productDetailsTokens.length > 0 && (
				<AccordionSection title="Product Details Variants" collapsibleClassName="p-0 border-b-0">
					{productDetailsTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Product Details`}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ProductDetailsStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}
		</>
	);
};

interface TAdvancedTabProps {
	editor: TPageEditor;
}
