import { resolveStyleReference, TMediaNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedMedia, TResolvedMediaNode } from '../../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveMediaNode(node: TMediaNode, cx: TNodeResolutionContext): TResolvedMediaNode {
	const { content, style, ...rest } = node;

	let media: TResolvedMedia | undefined;
	if (content.media != null) {
		const assetUrl = resolveAsset(content.media.hash, cx.assetsMap);
		if (assetUrl != null) {
			media = {
				...content.media,
				url: assetUrl
			};
		}
	}

	return {
		...rest,
		content: {
			media
		},
		style: {
			padding: resolveStyleReference(style.padding, cx.defaultStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, cx.defaultStyles?.backgroundColor),
			borderRadius: resolveStyleReference(style.borderRadius, cx.defaultStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, cx.defaultStyles?.shadow)
		}
	};
}
