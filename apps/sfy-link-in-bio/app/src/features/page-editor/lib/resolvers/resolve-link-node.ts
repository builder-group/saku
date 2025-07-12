import { resolveStyleReference, TLinkNode } from '@repo/editor';
import { TNodeResolutionContext, TResolvedLinkNode, TResolvedPromisedNode } from '../../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveLinkNode(
	node: TLinkNode,
	cx: TNodeResolutionContext
): TResolvedPromisedNode<TResolvedLinkNode> {
	const resolvedNode: TResolvedLinkNode = {
		...node,
		meta: {
			title: node.meta.title,
			description: node.meta.description,
			favicon: resolveAsset(node.meta.favicon, cx.assetsMap)
		},
		fetchedMeta: node.fetchedMeta
			? {
					title: node.fetchedMeta.title,
					description: node.fetchedMeta.description,
					favicon: resolveAsset(node.fetchedMeta.favicon, cx.assetsMap)
				}
			: undefined,
		style: {
			padding: resolveStyleReference(node.style.padding, cx.defaultStyles?.padding),
			backgroundColor: resolveColor(node.style.backgroundColor, cx.defaultStyles?.backgroundColor),
			font: resolveStyleReference(node.style.font, cx.defaultStyles?.font),
			fontSize: resolveStyleReference(node.style.fontSize, cx.defaultStyles?.fontSize),
			textColor: resolveColor(node.style.textColor, cx.defaultStyles?.textColor),
			textAlign: resolveStyleReference(node.style.textAlign, cx.defaultStyles?.textAlign),
			borderRadius: resolveStyleReference(node.style.borderRadius, cx.defaultStyles?.borderRadius),
			shadow: resolveStyleReference(node.style.shadow, cx.defaultStyles?.shadow)
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
