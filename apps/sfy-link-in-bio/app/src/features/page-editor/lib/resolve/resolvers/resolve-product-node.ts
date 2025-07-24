import { notEmpty } from '@blgc/utils';
import { resolveStyleReference, TProductNode } from '@repo/editor';
import { TResolvedProductNode } from '../../../types';
import { TNodeResolveContext } from '../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolveContext
): TResolvedProductNode {
	const { content, style, ...rest } = node;
	const parentStyles = cx.resolved?.parentStyles;

	let product: TResolvedProductNode['content']['product'] | undefined;
	if (content.product != null) {
		const variant = content.product.variants
			.map((variant) => ({
				...variant,
				image: resolveAsset(variant.image, cx.site)
			}))
			.filter(notEmpty)[0];

		product = {
			id: content.product.id,
			title: content.product.title,
			images: content.product.images.map((asset) => resolveAsset(asset, cx.site)).filter(notEmpty),
			options: content.product.options,
			variant
		};
	}

	return {
		...rest,
		content: {
			product
		},
		style: {
			padding: resolveStyleReference(style.padding, parentStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, parentStyles?.backgroundColor),
			font: resolveStyleReference(style.font, parentStyles?.font),
			fontSize: resolveStyleReference(style.fontSize, parentStyles?.fontSize),
			textColor: resolveColor(style.textColor, parentStyles?.textColor),
			borderRadius: resolveStyleReference(style.borderRadius, parentStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, parentStyles?.shadow)
		}
	};
}
