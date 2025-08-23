import { notEmpty } from '@blgc/utils';
import { TProductNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveFillStyleMixin,
	resolveLayoutStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTypographyStyleMixin
} from '../../mixins';
import { TResolvedProduct, TResolvedProductNode } from './types';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolveContext
): TResult<TResolvedProductNode, AppError> {
	const { content, layout, appearance, typography, fill, stroke, shadow, ...rest } = node;

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

	const [isResolvedLayoutOk, resolvedLayoutErr, resolvedLayout] = resolveLayoutStyleMixin(
		layout,
		cx.childMixins?.layout
	);
	if (!isResolvedLayoutOk) {
		return Err(resolvedLayoutErr.wrapWith('#ERR_RESOLVE_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, cx.childMixins?.appearance);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedTypographyOk, resolvedTypographyErr, resolvedTypography] =
		resolveTypographyStyleMixin(typography, cx.childMixins?.typography);
	if (!isResolvedTypographyOk) {
		return Err(resolvedTypographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(
		fill,
		cx.site,
		cx.childMixins?.fill
	);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		stroke,
		cx.childMixins?.stroke
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		shadow,
		cx.childMixins?.shadow
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			product: resolvedProduct
		},
		layout: resolvedLayout,
		appearance: resolvedAppearance,
		typography: resolvedTypography,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow
	});
}
