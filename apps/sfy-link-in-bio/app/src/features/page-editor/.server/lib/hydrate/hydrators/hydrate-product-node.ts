import { TProductNode } from '@repo/editor';
import { resolveProductNode } from '../../../../lib';
import { TResolvedProductNode, TResolvedPromisedNode } from '../../../../types';
import { TNodeHydrateContext } from '../types';

export function hydrateProductNode(
	node: TProductNode,
	cx: TNodeHydrateContext
): TResolvedPromisedNode<TResolvedProductNode> {
	const resolvedNode = resolveProductNode(node, cx);

	return {
		type: 'promised',
		id: node.id,
		cached: resolvedNode,
		next: (async () => {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			if (resolvedNode.content.product != null) {
				resolvedNode.content.product.title = `${resolvedNode.content.product.title} (resolved at ${new Date().toISOString()})`;
			}

			// let checkoutUrl: string = '';
			// if (cx.site.shopId != null && variant?.id != null) {
			//     const numericId =
			//         typeof variant.id === 'string' && variant.id.includes('gid://')
			//             ? variant.id.split('/').pop()
			//             : variant.id;
			//     checkoutUrl = `https://${cx.site.shopId}/cart/${numericId}:1`;
			// }

			// TODO: Refetch product data
			return resolvedNode;
		})()
	};
}
