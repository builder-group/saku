import {
	TAppearanceStyleMixin,
	TAppearanceStyleToken,
	TAutoLayoutStyleMixin,
	TAutoLayoutStyleToken,
	TBadgeStyleMixin,
	TBadgeStyleToken,
	TButtonStyleMixin,
	TButtonStyleToken,
	TFillStyleMixin,
	TFillStyleToken,
	TImageStyleMixin,
	TImageStyleToken,
	TProductDetailsStyleMixin,
	TProductDetailsStyleToken,
	TShadowStyleMixin,
	TShadowStyleToken,
	TStrokeStyleMixin,
	TStrokeStyleToken,
	TTextStyleMixin,
	TTextStyleToken
} from '@repo/editor';
import { TState } from 'feature-state';
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
	TextStyleMixinEditor
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
	// const typographyTokens = useMixinTokens<TTypographyStyleToken['value']>(
	// 	editor.mixinTokenMap.typography
	// );
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

			{/* Auto Layout Section */}
			{autoLayoutTokens.length > 0 && (
				<AccordionSection title="Layout" collapsibleClassName="p-0 border-b-0">
					{autoLayoutTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<AutoLayoutStyleMixinEditor
								state={state as TState<TAutoLayoutStyleMixin['value'], any>}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Appearance Section */}
			{appearanceTokens.length > 0 && (
				<AccordionSection title="Appearance" collapsibleClassName="p-0 border-b-0">
					{appearanceTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<AppearanceStyleMixinEditor
								state={state as TState<TAppearanceStyleMixin['value'], any>}
								disabledTokenLink
								editor={editor}
								disabledVisibilityToggle
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Typography Section */}
			{/* {typographyTokens.length > 0 && (
				<AccordionSection title="Typography" collapsibleClassName="p-0 border-b-0">
					{typographyTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<TypographyStyleMixinEditor
								state={state}
								mapValue={(value) => value}
								applyValue={(state, value) => {
									state._v = value as TTypographyStyleToken['value'];
								}}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)} */}

			{/* Fill Section */}
			{fillTokens.length > 0 && (
				<AccordionSection title="Fill" collapsibleClassName="p-0 border-b-0">
					{fillTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<FillStyleMixinEditor
								state={state as TState<TFillStyleMixin['value'], any>}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Stroke Section */}
			{strokeTokens.length > 0 && (
				<AccordionSection title="Stroke" collapsibleClassName="p-0 border-b-0">
					{strokeTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<StrokeStyleMixinEditor
								state={state as TState<TStrokeStyleMixin['value'], any>}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Shadow Section */}
			{shadowTokens.length > 0 && (
				<AccordionSection title="Shadow" collapsibleClassName="p-0 border-b-0">
					{shadowTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ShadowStyleMixinEditor
								state={state as TState<TShadowStyleMixin['value'], any>}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Button Section */}
			{buttonTokens.length > 0 && (
				<AccordionSection title="Button" collapsibleClassName="p-0 border-b-0">
					{buttonTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ButtonStyleMixinEditor
								state={state as TState<TButtonStyleMixin['value'], any>}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Badge Section */}
			{badgeTokens.length > 0 && (
				<AccordionSection title="Badge" collapsibleClassName="p-0 border-b-0">
					{badgeTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<BadgeStyleMixinEditor
								state={state as TState<TBadgeStyleMixin['value'], any>}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Text Section */}
			{textTokens.length > 0 && (
				<AccordionSection title="Text" collapsibleClassName="p-0 border-b-0">
					{textTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<TextStyleMixinEditor
								state={state as TState<TTextStyleMixin['value'], any>}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Image Section */}
			{imageTokens.length > 0 && (
				<AccordionSection title="Image" collapsibleClassName="p-0 border-b-0">
					{imageTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ImageStyleMixinEditor
								state={state as TState<TImageStyleMixin['value'], any>}
								disabledTokenLink
								editor={editor}
							/>
						</AccordionSection>
					))}
				</AccordionSection>
			)}

			{/* Product Details Section */}
			{productDetailsTokens.length > 0 && (
				<AccordionSection title="Product Details" collapsibleClassName="p-0 border-b-0">
					{productDetailsTokens.map(({ variant, state }) => (
						<AccordionSection
							key={variant}
							title={variant.charAt(0).toUpperCase() + variant.slice(1)}
							collapsibleClassName="px-0 space-y-3"
							size="tight"
							defaultOpen={true}
						>
							<ProductDetailsStyleMixinEditor
								state={state as TState<TProductDetailsStyleMixin['value'], any>}
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
