import { resolveReference, TMediaNode } from '@repo/editor';
import { resolveAsset, resolveColor, TNodeResolveContext } from '../../lib';
import { TResolvedMedia, TResolvedMediaNode } from '../../types';

export function resolveMediaNode(node: TMediaNode, cx: TNodeResolveContext): TResolvedMediaNode {
	const { content, style, ...rest } = node;
	const parentStyles = cx.resolved?.childDefaults;

	let media: TResolvedMedia | undefined;
	switch (content.media?.type) {
		case 'image': {
			const assetUrl = resolveAsset(content.media.hash, cx.site);
			if (assetUrl != null) {
				media = {
					...content.media,
					url: assetUrl
				};
			}
			break;
		}
		default:
		// do nothing
	}

	return {
		...rest,
		content: {
			media
		},
		style: {
			padding: resolveReference(style.padding, parentStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, parentStyles?.backgroundColor),
			borderRadius: resolveReference(style.borderRadius, parentStyles?.borderRadius),
			shadow: resolveReference(style.shadow, parentStyles?.shadow)
		}
	};
}
