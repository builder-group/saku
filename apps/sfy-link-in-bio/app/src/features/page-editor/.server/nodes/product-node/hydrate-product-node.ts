import { Err, Ok, TResult } from '@blgc/utils';
import { TProductNode } from '@repo/editor';
import { AppError } from '@/lib';
import { resolveProductNode, TResolvedProductNode, TResolvedPromisedNode } from '../../../nodes';
import { TNodeHydrateContext } from '../../lib';

export function hydrateProductNode(
	node: TProductNode,
	cx: TNodeHydrateContext
): TResult<TResolvedPromisedNode<TResolvedProductNode>, AppError> {
	const resolveProductNodeResult = resolveProductNode(node, cx);
	if (resolveProductNodeResult.isErr()) {
		return Err(AppError.wrap(resolveProductNodeResult.error, '#ERR_RESOLVE_PRODUCT_NODE'));
	}

	return Ok({
		type: 'promised',
		id: node.id,
		cached: resolveProductNodeResult.value,
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
			).unwrap();
		})()
	});
}
