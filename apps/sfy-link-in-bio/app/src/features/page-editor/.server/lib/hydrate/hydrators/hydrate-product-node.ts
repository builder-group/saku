import { TProductNode } from '@repo/editor';
import { resolveProductNode } from '../../../../lib';
import { TResolvedProductNode, TResolvedPromisedNode } from '../../../../types';
import { TNodeHydrateContext } from '../types';

export function hydrateProductNode(
	node: TProductNode,
	cx: TNodeHydrateContext
): TResolvedPromisedNode<TResolvedProductNode> {
	return {
		type: 'promised',
		id: node.id,
		cached: resolveProductNode(node, cx),
		next: (async () => {
			const { content, ...rest } = node;
			await new Promise((resolve) => setTimeout(resolve, 3000));

			let product: TProductNode['content']['product'] | undefined;
			if (content.product != null) {
				const variant = content.product.variants[0];

				let checkoutUrl: string = '';
				if (variant?.id != null) {
					const numericId =
						typeof variant.id === 'string' && variant.id.includes('gid://')
							? variant.id.split('/').pop()
							: variant.id;
					checkoutUrl = `https://${cx.site.shopId}/cart/${numericId}:1`;
				}

				product = {
					...content.product,
					title: `${content.product.title} (resolved at ${new Date().toISOString()})`,
					checkoutUrl
				};
			}

			// TODO: Refetch product data

			return resolveProductNode(
				{
					content: {
						product
					},
					...rest
				},
				cx
			);
		})()
	};
}
