import { notEmpty } from '@blgc/utils';
import { TProductNode } from '@repo/editor';
import {
	resolveAppearanceStyleMixin,
	resolveAsset,
	resolveFillStyleMixin,
	resolveLayoutStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTypographyStyleMixin,
	TNodeResolveContext
} from '../../lib';
import { TResolvedProduct, TResolvedProductNode } from './types';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolveContext
): TResolvedProductNode {
	const { content, layout, appearance, typography, fill, stroke, shadow, ...rest } = node;

	let product: TResolvedProduct | undefined;
	if (content.product != null) {
		const variants = content.product.variants
			.map((variant) => ({
				...variant,
				image: variant.image != null ? resolveAsset(variant.image, cx.site) : undefined
			}))
			.filter(notEmpty);

		product = {
			id: content.product.id,
			title: content.product.title,
			images: content.product.images.map((asset) => resolveAsset(asset, cx.site)).filter(notEmpty),
			options: content.product.options,
			variants
		};
	}

	return {
		...rest,
		content: {
			product
		},
		layout: resolveLayoutStyleMixin(layout, cx.childMixins?.layout),
		appearance: resolveAppearanceStyleMixin(appearance, cx.childMixins?.appearance),
		typography: resolveTypographyStyleMixin(typography, cx.childMixins?.typography),
		fill: resolveFillStyleMixin(fill, cx.site, cx.childMixins?.fill),
		stroke: resolveStrokeStyleMixin(stroke, cx.childMixins?.stroke),
		shadow: resolveShadowStyleMixin(shadow, cx.childMixins?.shadow)
	};
}
