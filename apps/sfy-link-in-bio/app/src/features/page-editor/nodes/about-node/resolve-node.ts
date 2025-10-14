import { TAboutNode } from '@repo/editor';
import { Err, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../lib';
import { resolveClassicBundle, resolveHeroBundle } from './bundles';
import { TResolvedAboutNode } from './types';

export function resolveAboutNode(
	node: TAboutNode,
	cx: TNodeResolveContext
): TResult<TResolvedAboutNode, AppError> {
	switch (node.bundleType) {
		case 'classic':
			return resolveClassicBundle(node, cx);
		case 'hero':
			return resolveHeroBundle(node, cx);
		default:
			return Err(
				new AppError('#ERR_UNKNOWN_ABOUT_NODE_BUNDLE', { detail: 'Unknown about node bundle' })
			);
	}
}
