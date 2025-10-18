import { TTextNode } from '@repo/editor';
import { Err, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../../lib';
import { resolveRichBundle, resolveSectionTitleBundle } from '../bundles';
import { TResolvedTextNode } from '../types';

export function resolveTextNode(
	node: TTextNode,
	cx: TNodeResolveContext
): TResult<TResolvedTextNode, AppError> {
	switch (node.bundleType) {
		case 'rich':
			return resolveRichBundle(node, cx);
		case 'section-title':
			return resolveSectionTitleBundle(node, cx);
		default:
			return Err(
				new AppError('#ERR_UNKNOWN_TEXT_NODE_BUNDLE', { detail: 'Unknown text node bundle' })
			);
	}
}
