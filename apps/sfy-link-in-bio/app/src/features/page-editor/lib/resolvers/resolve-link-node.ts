import { resolveStyleReference, TLinkNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedLinkNode, TResolvedPromisedNode } from '../../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveLinkNode(
	node: TLinkNode,
	cx: TNodeResolutionContext
): TResolvedPromisedNode<TResolvedLinkNode> {
	const { content, style, ...rest } = node;

	const resolvedNode: TResolvedLinkNode = {
		...rest,
		content: {
			url: content.url,
			meta: {
				title: content.userMetadata.title ?? content.fetchedMetadata?.title,
				description: content.userMetadata.description ?? content.fetchedMetadata?.description,
				favicon: resolveAsset(
					content.userMetadata.favicon ?? content.fetchedMetadata?.favicon,
					cx.assetsMap
				)
			}
		},
		style: {
			padding: resolveStyleReference(style.padding, cx.defaultStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, cx.defaultStyles?.backgroundColor),
			font: resolveStyleReference(style.font, cx.defaultStyles?.font),
			fontSize: resolveStyleReference(style.fontSize, cx.defaultStyles?.fontSize),
			textColor: resolveColor(style.textColor, cx.defaultStyles?.textColor),
			textAlign: resolveStyleReference(style.textAlign, cx.defaultStyles?.textAlign),
			borderRadius: resolveStyleReference(style.borderRadius, cx.defaultStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, cx.defaultStyles?.shadow)
		}
	};

	return {
		type: 'promised',
		id: node.id,
		cached: resolvedNode,
		next: (async () => {
			await new Promise((resolve) => setTimeout(resolve, 3000));

			// TODO: Refetch link metadata
			return resolvedNode;
		})()
	};
}
