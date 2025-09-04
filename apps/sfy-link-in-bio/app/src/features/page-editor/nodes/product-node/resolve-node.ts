import { notEmpty } from '@blgc/utils';
import { TProduct, TProductNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
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
import { TResolvedProduct, TResolvedProductNode, TResolvedProductNodeContent } from './types';

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
		primaryButton,
		badge,
		image,
		productDetails,
		...rest
	} = node;

	// Resolve content
	let resolvedContent: TResolvedProductNodeContent;
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
			mixinTokenSet: cx.site.getMixinTokenSet('autoLayout'),
			mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
			variableTokenMap: cx.site.getVariableTokenMap()
		});
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, {
			node: cx,
			mixinTokenSet: cx.site.getMixinTokenSet('appearance'),
			mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
			variableTokenMap: cx.site.getVariableTokenMap()
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(fill, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('fill'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(stroke, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('stroke'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(shadow, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('shadow'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(text, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('text'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}
	const [isResolvedPrimaryButtonOk, resolvedPrimaryButtonErr, resolvedPrimaryButton] =
		resolveButtonStyleMixin(primaryButton, {
			node: cx,
			mixinTokenSet: cx.site.getMixinTokenSet('button'),
			mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
			variableTokenMap: cx.site.getVariableTokenMap()
		});
	if (!isResolvedPrimaryButtonOk) {
		return Err(resolvedPrimaryButtonErr.wrapWith('#ERR_RESOLVE_BUTTON_STYLE'));
	}
	const [isResolvedBadgeOk, resolvedBadgeErr, resolvedBadge] = resolveBadgeStyleMixin(badge, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('badge'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedBadgeOk) {
		return Err(resolvedBadgeErr.wrapWith('#ERR_RESOLVE_BADGE_STYLE'));
	}
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(image, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('image'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedImageOk) {
		return Err(resolvedImageErr.wrapWith('#ERR_RESOLVE_IMAGE_STYLE'));
	}
	const [isResolvedProductDetailsOk, resolvedProductDetailsErr, resolvedProductDetails] =
		resolveProductDetailsStyleMixin(productDetails, {
			node: cx,
			mixinTokenSet: cx.site.getMixinTokenSet('productDetails'),
			mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
			variableTokenMap: cx.site.getVariableTokenMap()
		});
	if (!isResolvedProductDetailsOk) {
		return Err(resolvedProductDetailsErr.wrapWith('#ERR_RESOLVE_PRODUCT_DETAILS_STYLE'));
	}

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		text: resolvedText,
		primaryButton: resolvedPrimaryButton,
		badge: resolvedBadge,
		image: resolvedImage,
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
