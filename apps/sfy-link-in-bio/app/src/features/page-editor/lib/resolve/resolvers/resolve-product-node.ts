import { notEmpty } from '@blgc/utils';
import { resolveStyleReference, TProductNode } from '@repo/editor';
import { TResolvedProductNode, TResolvedPromisedNode } from '../../../types';
import { TNodeResolutionContext } from '../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolutionContext
): TResolvedPromisedNode<TResolvedProductNode> | TResolvedProductNode {
	const { content, style, ...rest } = node;
	const defaultStyles = cx.resolved?.parentStyles;

	let product: TResolvedProductNode['content']['product'] | undefined;
	if (content.product != null) {
		const variant = content.product.variants
			.map((variant) => ({
				...variant,
				image: resolveAsset(variant.image, cx.site)
			}))
			.filter(notEmpty)[0];

		let checkoutUrl: string = '';
		if (cx.site.shopId != null && variant?.id != null) {
			const numericId =
				typeof variant.id === 'string' && variant.id.includes('gid://')
					? variant.id.split('/').pop()
					: variant.id;
			checkoutUrl = `https://${cx.site.shopId}/cart/${numericId}:1`;
		}

		product = {
			id: content.product.id,
			title: content.product.title,
			images: content.product.images.map((asset) => resolveAsset(asset, cx.site)).filter(notEmpty),
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
			padding: resolveStyleReference(style.padding, defaultStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, defaultStyles?.backgroundColor),
			font: resolveStyleReference(style.font, defaultStyles?.font),
			fontSize: resolveStyleReference(style.fontSize, defaultStyles?.fontSize),
			textColor: resolveColor(style.textColor, defaultStyles?.textColor),
			borderRadius: resolveStyleReference(style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, defaultStyles?.shadow)
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
