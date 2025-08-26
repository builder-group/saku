import { notEmpty } from '@blgc/utils';
import { TProductNode } from '@repo/editor';
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
import { TResolvedProduct, TResolvedProductNode } from './types';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolveContext
): TResult<TResolvedProductNode, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, text, button, ...rest } = node;

	let resolvedProduct: TResolvedProduct | undefined;
	if (content.product != null) {
		const variants = content.product.variants
			.map((variant) => ({
				...variant,
				image: variant.image != null ? resolveAsset(variant.image, cx.site) : undefined
			}))
			.filter(notEmpty);

		resolvedProduct = {
			id: content.product.id,
			title: content.product.title,
			description: content.product.description,
			images: content.product.images.map((asset) => resolveAsset(asset, cx.site)).filter(notEmpty),
			options: content.product.options,
			variants
		};
	}

	const [isResolvedAutoLayoutOk, resolvedAutoLayoutErr, resolvedAutoLayout] =
		resolveAutoLayoutStyleMixin(autoLayout, cx);
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, cx);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(fill, cx);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		stroke,
		cx
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		shadow,
		cx
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(text, cx);
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}
	const [isResolvedButtonOk, resolvedButtonErr, resolvedButton] = resolveButtonStyleMixin(
		button,
		cx
	);
	if (!isResolvedButtonOk) {
		return Err(resolvedButtonErr.wrapWith('#ERR_RESOLVE_BUTTON_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			product: resolvedProduct
		},
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		text: resolvedText,
		button: resolvedButton
	});
}
