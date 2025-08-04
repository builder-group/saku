import { TProductNode } from '@repo/editor';
import { resolveProductNode } from '../../..';
import { TResolvedProductNode, TResolvedPromisedNode } from '../../../../../types';
import { TNodeHydrateContext } from '../../types';

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
			// await new Promise((resolve) => setTimeout(resolve, 3000));

			let product: TProductNode['content']['product'] | undefined;
			if (content.product != null) {
				product = {
					...content.product
					// title: `${content.product.title} (resolved at ${new Date().toISOString()})`
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
