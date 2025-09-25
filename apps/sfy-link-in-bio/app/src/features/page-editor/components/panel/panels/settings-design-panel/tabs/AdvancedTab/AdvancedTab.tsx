import {
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TBadgeStyleMixin,
	TButtonStyleMixin,
	TFillStyleMixin,
	TImageStyleMixin,
	TProductDetailsStyleMixin,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextStyleMixin
} from '@repo/editor';
import { Banner } from '@shopify/polaris';
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
import { useTokensByType } from './use-tokens-by-type';

export const AdvancedTab: React.FC<TAdvancedTabProps> = (props) => {
	const { editor } = props;

	const autoLayoutTokens = useTokensByType('auto-layout', editor.tokenMap);
	const appearanceTokens = useTokensByType('appearance', editor.tokenMap);
	// const typographyTokens = useTokensByType(
	// 	'typography',
	// 	editor.tokenMap
	// );
	const fillTokens = useTokensByType('fill', editor.tokenMap);
	const strokeTokens = useTokensByType('stroke', editor.tokenMap);
	const shadowTokens = useTokensByType('shadow', editor.tokenMap);
	const buttonTokens = useTokensByType('button', editor.tokenMap);
	const badgeTokens = useTokensByType('badge', editor.tokenMap);
	const textTokens = useTokensByType('text', editor.tokenMap);
	const imageTokens = useTokensByType('image', editor.tokenMap);
	const productDetailsTokens = useTokensByType('product-details', editor.tokenMap);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<div className="p-2">
				<Banner tone="info">
					Only use these advanced settings if the basic design options aren't enough.
					<br />
					<br />
					Here you can customize design tokens that can be linked to layers throughout your page for
					consistent styling.
				</Banner>
			</div>

			{/* Page Section */}
			<AccordionSection title="Page" collapsibleClassName="px-0 space-y-3" defaultOpen={true}>
				<PageNodeEditor nodeState={editor.getRootNode()} editor={editor} />
			</AccordionSection>

			{/* Auto Layout Section */}
			{autoLayoutTokens.length > 0 && (
				<AccordionSection title="Layout" collapsibleClassName="p-0 border-b-0">
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
								editor={editor}
								disabledVisibilityToggle
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
