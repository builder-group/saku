import { resolveStyleReference, TMediaNode } from '@repo/editor';
import { TResolvedMedia, TResolvedMediaNode } from '../../../types';
import { TNodeResolutionContext } from '../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveMediaNode(node: TMediaNode, cx: TNodeResolutionContext): TResolvedMediaNode {
	const { content, style, ...rest } = node;
	const defaultStyles = cx.resolved?.parentStyles;

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
			padding: resolveStyleReference(style.padding, defaultStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, defaultStyles?.backgroundColor),
			borderRadius: resolveStyleReference(style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, defaultStyles?.shadow)
		}
	};
}
