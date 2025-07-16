import { resolveStyleReference, TMediaNode } from '@repo/editor';
import { TResolvedMedia, TResolvedMediaNode } from '../../../types';
import { TNodeResolveContext } from '../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveMediaNode(node: TMediaNode, cx: TNodeResolveContext): TResolvedMediaNode {
	const { content, style, ...rest } = node;
	const parentStyles = cx.resolved?.parentStyles;

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
			padding: resolveStyleReference(style.padding, parentStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, parentStyles?.backgroundColor),
			borderRadius: resolveStyleReference(style.borderRadius, parentStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, parentStyles?.shadow)
		}
	};
}
