import { resolveStyleReference, TMediaNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedMediaNode } from '../../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveMediaNode(node: TMediaNode, cx: TNodeResolutionContext): TResolvedMediaNode {
	return {
		...node,
		media: {
			type: node.media.type,
			url: resolveAsset(node.media.hash, cx.assetsMap) ?? '',
			altText: node.media.altText
		},
		style: {
			padding: resolveStyleReference(node.style.padding, cx.defaultStyles?.padding),
			backgroundColor: resolveColor(node.style.backgroundColor, cx.defaultStyles?.backgroundColor),
			borderRadius: resolveStyleReference(node.style.borderRadius, cx.defaultStyles?.borderRadius),
			shadow: resolveStyleReference(node.style.shadow, cx.defaultStyles?.shadow)
		}
	};
}
