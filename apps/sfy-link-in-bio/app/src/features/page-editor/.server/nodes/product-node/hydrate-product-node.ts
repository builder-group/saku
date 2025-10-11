import { TProductNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveProductNode, TResolvedProductNode, TResolvedPromisedNode } from '../../../nodes';
import { TNodeHydrateContext } from '../../lib';

export function hydrateProductNode(
	node: TProductNode,
	cx: TNodeHydrateContext
): TResult<TResolvedPromisedNode<TResolvedProductNode>, AppError> {
	const [isResolvedProductNodeOk, resolvedProductNodeErr, resolvedProductNode] = resolveProductNode(
		node,
		cx
	);
	if (!isResolvedProductNodeOk) {
		return Err(resolvedProductNodeErr.wrapWith('#ERR_RESOLVE_PRODUCT_NODE'));
	}

	return Ok({
		type: 'promised',
		bundleType: 'default',
		id: node.id,
		cached: resolvedProductNode,
		next: (async () => {
			const { content, ...rest } = node;

			// TODO: Refetch product data

			return resolveProductNode(
				{
					content,
					...rest
				},
				cx
			).unwrap();
		})()
	});
}
