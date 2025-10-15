import { TMediaNode } from '@repo/editor';
import { Err, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../../lib';
import { resolveClassicBundle } from '../bundles';
import { TResolvedMediaNode } from '../types';

export function resolveMediaNode(
	node: TMediaNode,
	cx: TNodeResolveContext
): TResult<TResolvedMediaNode, AppError> {
	switch (node.bundleType) {
		case 'classic':
			return resolveClassicBundle(node, cx);
		default:
			return Err(
				new AppError('#ERR_UNKNOWN_MEDIA_NODE_BUNDLE', { detail: 'Unknown media node bundle' })
			);
	}
}
