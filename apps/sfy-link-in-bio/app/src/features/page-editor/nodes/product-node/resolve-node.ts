import { notEmpty } from '@blgc/utils';
import { resolveReference, TProductNode } from '@repo/editor';
import { resolveAsset, resolveColor, TNodeResolveContext } from '../../lib';
import { TResolvedProductNode } from '../../types';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolveContext
): TResolvedProductNode {
	const { content, style, ...rest } = node;
	const parentStyles = cx.resolved?.childDefaults;

	let product: TResolvedProductNode['content']['product'] | undefined;
	if (content.product != null) {
		const variants = content.product.variants
			.map((variant) => ({
				...variant,
				image: resolveAsset(variant.image, cx.site)
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
		style: {
			padding: resolveReference(style.padding, parentStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, parentStyles?.backgroundColor),
			font: resolveReference(style.font, parentStyles?.font),
			fontSize: resolveReference(style.fontSize, parentStyles?.fontSize),
			textColor: resolveColor(style.textColor, parentStyles?.textColor),
			borderRadius: resolveReference(style.borderRadius, parentStyles?.borderRadius),
			shadow: resolveReference(style.shadow, parentStyles?.shadow)
		}
	};
}
