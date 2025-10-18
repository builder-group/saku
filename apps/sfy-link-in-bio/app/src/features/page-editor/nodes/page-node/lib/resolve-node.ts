import { TFlatPageNode } from '@repo/editor';
import { Err, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../../lib';
import { resolveClassicBundle, resolveClassicBundleWithoutChildren } from '../bundles';
import { TResolvedPageNode } from '../types';

export function resolvePageNode(
	node: TFlatPageNode,
	cx: TNodeResolveContext
): TResult<TResolvedPageNode, AppError> {
	switch (node.bundleType) {
		case 'classic':
			return resolveClassicBundle(node, cx);
		default:
			return Err(
				new AppError('#ERR_UNKNOWN_PAGE_NODE_BUNDLE', { detail: 'Unknown page node bundle' })
			);
	}
}

export function resolvePageNodeWithoutChildren(
	node: TFlatPageNode,
	cx: TNodeResolveContext
): TResult<Omit<TResolvedPageNode, 'children'>, AppError> {
	switch (node.bundleType) {
		case 'classic':
			return resolveClassicBundleWithoutChildren(node, cx);
		default:
			return Err(
				new AppError('#ERR_UNKNOWN_PAGE_NODE_BUNDLE', { detail: 'Unknown page node bundle' })
			);
	}
}
