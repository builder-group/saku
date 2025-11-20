import {
	TAppearanceStyleMixin,
	TAutoLayoutStyleMixin,
	TBadgeNeutralStyleMixin,
	TBadgeSecondaryStyleMixin,
	TBannerStyleMixin,
	TButtonPrimaryStyleMixin,
	TFillStyleMixin,
	TIdMixin,
	TImageStyleMixin,
	TIntegrationId,
	TProduct,
	TProductAction,
	TProductDetailsStyleMixin,
	TProductNode,
	TRichContent,
	TShadowStyleMixin,
	TStrokeStyleMixin,
	TTextBodyStyleMixin
} from '@repo/editor';
import { TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeState, TPageEditor } from '../../../lib';
import { classicBundleMetadata, featuredBundleMetadata } from '../bundles';

export const productNodeBundleMetadataMap = {
	classic: classicBundleMetadata,
	featured: featuredBundleMetadata
};

export const productNodeBundleMetadata = Object.values(productNodeBundleMetadataMap);

export interface TProductNodeBundleMetadata<GNode extends TProductNode = TProductNode> {
	type: GNode['bundleType'];
	label: string;
	/**
	 * Creates a new node bundle, replacing the entire node with the new bundle
	 */
	switch: (cx: {
		node: TNodeState<GNode>;
		common: TCommonFields;
		editor: TPageEditor;
	}) => Promise<TResult<void, AppError>>;
	/**
	 * Extracts common fields from a node bundle
	 */
	extractCommonFields: (node: GNode) => TCommonFields;
}

interface TCommonFields {
	id: TIdMixin['value'];
	content?: {
		product?: TProduct;
		banner?: {
			label: string;
		};
		cta?: {
			visible: boolean;
			label: string;
			action: TProductAction;
		};
		variants?: {
			visible: boolean;
		};
		// User overrides (take priority)
		overrides: {
			title?: string;
			description?: TRichContent;
		};
		integrationId?: TIntegrationId;
	};
	autoLayout?: TAutoLayoutStyleMixin['value'];
	appearance?: TAppearanceStyleMixin['value'];
	fill?: TFillStyleMixin['value'];
	stroke?: TStrokeStyleMixin['value'];
	shadow?: TShadowStyleMixin['value'];
	textBody?: TTextBodyStyleMixin['value'];
	buttonPrimary?: TButtonPrimaryStyleMixin['value'];
	badgeSecondary?: TBadgeSecondaryStyleMixin['value'];
	badgeNeutral?: TBadgeNeutralStyleMixin['value'];
	banner?: TBannerStyleMixin['value'];
	image?: TImageStyleMixin['value'];
	productDetails?: TProductDetailsStyleMixin['value'];
}
