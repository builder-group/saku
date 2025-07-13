import { notEmpty } from '@blgc/utils';
import { resolveStyleReference, TProductNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedProductNode, TResolvedPromisedNode } from '../../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolutionContext
): TResolvedPromisedNode<TResolvedProductNode> | TResolvedProductNode {
	const { content, style, ...rest } = node;

	let product: TResolvedProductNode['content']['product'] | undefined;
	if (content.product != null) {
		const variant = content.product.variants
			.map((variant) => ({
				...variant,
				image: resolveAsset(variant.image, cx.assetsMap)
			}))
			.filter(notEmpty)[0];

		let checkoutUrl: string = '';
		if (cx.shopId != null && variant?.id != null) {
			const numericId =
				typeof variant.id === 'string' && variant.id.includes('gid://')
					? variant.id.split('/').pop()
					: variant.id;
			checkoutUrl = `https://${cx.shopId}/cart/${numericId}:1`;
		}

		product = {
			id: content.product.id,
			title: content.product.title,
			images: content.product.images
				.map((asset) => resolveAsset(asset, cx.assetsMap))
				.filter(notEmpty),
			options: content.product.options,
			variant,
			checkoutUrl
		};
	}

	const resolvedNode: TResolvedProductNode = {
		...rest,
		content: {
			product
		},
		style: {
			padding: resolveStyleReference(style.padding, cx.defaultStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, cx.defaultStyles?.backgroundColor),
			font: resolveStyleReference(style.font, cx.defaultStyles?.font),
			fontSize: resolveStyleReference(style.fontSize, cx.defaultStyles?.fontSize),
			textColor: resolveColor(style.textColor, cx.defaultStyles?.textColor),
			borderRadius: resolveStyleReference(style.borderRadius, cx.defaultStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, cx.defaultStyles?.shadow)
		}
	};

	return resolvedNode;

	// return {
	// 	type: 'promised',
	// 	id: node.id,
	// 	cached: resolvedNode,
	// 	next: (async () => {
	// 		await new Promise((resolve) => setTimeout(resolve, 3000));
	// 		// TODO: Refetch product data
	// 		return resolvedNode;
	// 	})()
	// };
}
