import { TProductNode } from '@repo/editor';
import { Err, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../../lib';
import { resolveClassicBundle, resolveFeaturedBundle } from '../bundles';
import { TResolvedProductNode } from '../types';

export function resolveProductNode(
	node: TProductNode,
	cx: TNodeResolveContext
): TResult<TResolvedProductNode, AppError> {
	switch (node.bundleType) {
		case 'classic':
			return resolveClassicBundle(node, cx);
		case 'featured':
			return resolveFeaturedBundle(node, cx);
		default:
			return Err(
				new AppError('#ERR_UNKNOWN_PRODUCT_NODE_BUNDLE', { detail: 'Unknown product node bundle' })
			);
	}
}
