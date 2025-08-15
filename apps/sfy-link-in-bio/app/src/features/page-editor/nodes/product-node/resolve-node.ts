import { Err, notEmpty, Ok, TResult } from '@blgc/utils';
import { TProductNode } from '@repo/editor';
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
			images: content.product.images.map((asset) => resolveAsset(asset, cx.site)).filter(notEmpty),
			options: content.product.options,
			variants
		};
	}

	const resolveLayoutResult = resolveLayoutStyleMixin(layout, cx.childMixins?.layout);
	if (resolveLayoutResult.isErr()) {
		return Err(AppError.wrap(resolveLayoutResult.error, '#ERR_RESOLVE_LAYOUT_STYLE'));
	}
	const resolveAppearanceResult = resolveAppearanceStyleMixin(
		appearance,
		cx.childMixins?.appearance
	);
	if (resolveAppearanceResult.isErr()) {
		return Err(AppError.wrap(resolveAppearanceResult.error, '#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const resolveTypographyResult = resolveTypographyStyleMixin(
		typography,
		cx.childMixins?.typography
	);
	if (resolveTypographyResult.isErr()) {
		return Err(AppError.wrap(resolveTypographyResult.error, '#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const resolveFillResult = resolveFillStyleMixin(fill, cx.site, cx.childMixins?.fill);
	if (resolveFillResult.isErr()) {
		return Err(AppError.wrap(resolveFillResult.error, '#ERR_RESOLVE_FILL_STYLE'));
	}
	const resolveStrokeResult = resolveStrokeStyleMixin(stroke, cx.childMixins?.stroke);
	if (resolveStrokeResult.isErr()) {
		return Err(AppError.wrap(resolveStrokeResult.error, '#ERR_RESOLVE_STROKE_STYLE'));
	}
	const resolveShadowResult = resolveShadowStyleMixin(shadow, cx.childMixins?.shadow);
	if (resolveShadowResult.isErr()) {
		return Err(AppError.wrap(resolveShadowResult.error, '#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			product: resolvedProduct
		},
		layout: resolveLayoutResult.value,
		appearance: resolveAppearanceResult.value,
		typography: resolveTypographyResult.value,
		fill: resolveFillResult.value,
		stroke: resolveStrokeResult.value,
		shadow: resolveShadowResult.value
	});
}
