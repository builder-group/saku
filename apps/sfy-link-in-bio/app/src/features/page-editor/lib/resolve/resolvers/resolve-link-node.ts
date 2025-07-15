import { resolveStyleReference, TLinkNode } from '@repo/editor';
import { TResolvedLinkNode, TResolvedPromisedNode } from '../../../types';
import { TNodeResolutionContext } from '../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveLinkNode(
	node: TLinkNode,
	cx: TNodeResolutionContext
): TResolvedPromisedNode<TResolvedLinkNode> | TResolvedLinkNode {
	const { content, style, ...rest } = node;
	const defaultStyles = cx.resolved?.parentStyles;

	const resolvedNode: TResolvedLinkNode = {
		...rest,
		content: {
			url: content.url,
			meta: {
				title: content.userMetadata.title ?? content.fetchedMetadata?.title,
				description: content.userMetadata.description ?? content.fetchedMetadata?.description,
				favicon: resolveAsset(
					content.userMetadata.favicon ?? content.fetchedMetadata?.favicon,
					cx.site
				)
			}
		},
		style: {
			padding: resolveStyleReference(style.padding, defaultStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, defaultStyles?.backgroundColor),
			font: resolveStyleReference(style.font, defaultStyles?.font),
			fontSize: resolveStyleReference(style.fontSize, defaultStyles?.fontSize),
			textColor: resolveColor(style.textColor, defaultStyles?.textColor),
			textAlign: resolveStyleReference(style.textAlign, defaultStyles?.textAlign),
			borderRadius: resolveStyleReference(style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, defaultStyles?.shadow)
		}
	};

	return resolvedNode;

	// return {
	// 	type: 'promised',
	// 	id: node.id,
	// 	cached: resolvedNode,
	// 	next: (async () => {
	// 		await new Promise((resolve) => setTimeout(resolve, 3000));

	// 		// TODO: Refetch link metadata
	// 		return resolvedNode;
	// 	})()
	// };
}
