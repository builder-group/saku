import { notEmpty } from '@blgc/utils';
import { TProduct, TProductNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveButtonStyleMixin,
	resolveFillStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTextStyleMixin
} from '../../mixins';
import { TResolvedProduct, TResolvedProductNode, TResolvedProductNodeContent } from './types';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolveContext
): TResult<TResolvedProductNode, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, text, button, ...rest } = node;

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
			tokenSet: cx.site.getTokenSet('autoLayout'),
			mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
		});
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, {
			node: cx,
			tokenSet: cx.site.getTokenSet('appearance'),
			mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(fill, {
		node: cx,
		tokenSet: cx.site.getTokenSet('fill'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(stroke, {
		node: cx,
		tokenSet: cx.site.getTokenSet('stroke'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
	});
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(shadow, {
		node: cx,
		tokenSet: cx.site.getTokenSet('shadow'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
	});
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(text, {
		node: cx,
		tokenSet: cx.site.getTokenSet('text'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
	});
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}
	const [isResolvedButtonOk, resolvedButtonErr, resolvedButton] = resolveButtonStyleMixin(button, {
		node: cx,
		tokenSet: cx.site.getTokenSet('button'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
	});
	if (!isResolvedButtonOk) {
		return Err(resolvedButtonErr.wrapWith('#ERR_RESOLVE_BUTTON_STYLE'));
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
		button: resolvedButton
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
