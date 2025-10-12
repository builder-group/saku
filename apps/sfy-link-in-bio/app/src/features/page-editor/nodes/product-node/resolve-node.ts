import { notEmpty } from '@blgc/utils';
import { TProduct, TProductNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError, computeInnerBorderRadius } from '@/lib';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveBadgeStyleMixin,
	resolveButtonStyleMixin,
	resolveFillStyleMixin,
	resolveImageStyleMixin,
	resolveProductDetailsStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTextStyleMixin
} from '../../mixins';
import {
	TResolvedProduct,
	TResolvedProductNode,
	TResolvedSingleProductNodeContentMixin
} from './types';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolveContext
): TResult<TResolvedProductNode, AppError> {
	const {
		content,
		autoLayout,
		appearance,
		fill,
		stroke,
		shadow,
		text,
		buttonPrimary,
		badgeSecondary,
		badgeNeutral,
		image,
		productDetails,
		...rest
	} = node;

	// Resolve content
	let resolvedContent: TResolvedSingleProductNodeContentMixin['value'];
	switch (content.type) {
		case 'single': {
			let resolvedProduct: TResolvedProduct | undefined;
			if (content.product != null) {
				resolvedProduct = resolveProduct(content.product, cx);
			}
			resolvedContent = {
				...content,
				product: resolvedProduct
			};
		}
	}

	// Resolve styles
	const [isResolvedAutoLayoutOk, resolvedAutoLayoutErr, resolvedAutoLayout] =
		resolveAutoLayoutStyleMixin(autoLayout, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(fill, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(stroke, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(shadow, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(text, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}
	const [isResolvedButtonPrimaryOk, resolvedButtonPrimaryErr, resolvedButtonPrimary] =
		resolveButtonStyleMixin(buttonPrimary, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedButtonPrimaryOk) {
		return Err(resolvedButtonPrimaryErr.wrapWith('#ERR_RESOLVE_BUTTON_PRIMARY_STYLE'));
	}
	const [isResolvedBadgeSecondaryOk, resolvedBadgeSecondaryErr, resolvedBadgeSecondary] =
		resolveBadgeStyleMixin(badgeSecondary, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedBadgeSecondaryOk) {
		return Err(resolvedBadgeSecondaryErr.wrapWith('#ERR_RESOLVE_BADGE_SECONDARY_STYLE'));
	}
	const [isResolvedBadgeNeutralOk, resolvedBadgeNeutralErr, resolvedBadgeNeutral] =
		resolveBadgeStyleMixin(badgeNeutral, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedBadgeNeutralOk) {
		return Err(resolvedBadgeNeutralErr.wrapWith('#ERR_RESOLVE_BADGE_NEUTRAL_STYLE'));
	}
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(image, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedImageOk) {
		return Err(resolvedImageErr.wrapWith('#ERR_RESOLVE_IMAGE_STYLE'));
	}
	const [isResolvedProductDetailsOk, resolvedProductDetailsErr, resolvedProductDetails] =
		resolveProductDetailsStyleMixin(productDetails, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedProductDetailsOk) {
		return Err(resolvedProductDetailsErr.wrapWith('#ERR_RESOLVE_PRODUCT_DETAILS_STYLE'));
	}

	const imageBorderRadius =
		resolvedImage.appearance.borderRadius ??
		computeInnerBorderRadius(
			resolvedAppearance.borderRadius ?? 0,
			resolvedAutoLayout.verticalPadding,
			resolvedAutoLayout.horizontalPadding
		);

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		text: resolvedText,
		buttonPrimary: resolvedButtonPrimary,
		badgeSecondary: resolvedBadgeSecondary,
		badgeNeutral: resolvedBadgeNeutral,
		image: {
			...resolvedImage,
			appearance: {
				...resolvedImage.appearance,
				borderRadius: imageBorderRadius,
				styles: {
					...resolvedImage.appearance.styles,
					borderRadius: `${imageBorderRadius}px`
				}
			},
			styles: {
				...resolvedImage.appearance.styles,
				borderRadius: `${imageBorderRadius}px`
			}
		},
		productDetails: resolvedProductDetails
	});
}

export function resolveProduct(product: TProduct, cx: TNodeResolveContext): TResolvedProduct {
	const variants = product.variants
		.map((variant) => ({
			...variant,
			image: variant.image != null ? resolveAsset(variant.image, cx.site) : undefined
		}))
		.filter(notEmpty);

	return {
		id: product.id,
		title: product.title,
		description: product.description,
		images: product.images.map((asset) => resolveAsset(asset, cx.site)).filter(notEmpty),
		options: product.options,
		variants
	};
}
