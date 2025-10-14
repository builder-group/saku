import { TLinkNode } from '@repo/editor';
import { Err, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../lib';
import {
	resolveClassicBundle,
	resolveFeaturedBundle,
	resolveSpotifyEmbedBundle,
	resolveYouTubeEmbedBundle
} from './bundles';
import { TResolvedLinkNode } from './types';

export function resolveLinkNode(
	node: TLinkNode,
	cx: TNodeResolveContext
): TResult<TResolvedLinkNode, AppError> {
	switch (node.bundleType) {
		case 'classic':
			return resolveClassicBundle(node, cx);
		case 'featured':
			return resolveFeaturedBundle(node, cx);
		case 'youtube-embed':
			return resolveYouTubeEmbedBundle(node, cx);
		case 'spotify-embed':
			return resolveSpotifyEmbedBundle(node, cx);
		default:
			return Err(
				new AppError('#ERR_UNKNOWN_LINK_NODE_BUNDLE', {
					detail: `Unknown link node bundle`
				})
			);
	}
}
