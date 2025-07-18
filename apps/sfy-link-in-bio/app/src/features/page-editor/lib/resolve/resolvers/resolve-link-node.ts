import { resolveStyleReference, TLinkNode } from '@repo/editor';
import { TResolvedLinkNode } from '../../../types';
import { TNodeResolveContext } from '../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveLinkNode(node: TLinkNode, cx: TNodeResolveContext): TResolvedLinkNode {
	const { content, style, ...rest } = node;
	const parentStyles = cx.resolved?.parentStyles;

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
			padding: resolveStyleReference(style.padding, parentStyles?.padding),
			backgroundColor: resolveColor(style.backgroundColor, parentStyles?.backgroundColor),
			font: resolveStyleReference(style.font, parentStyles?.font),
			fontSize: resolveStyleReference(style.fontSize, parentStyles?.fontSize),
			textColor: resolveColor(style.textColor, parentStyles?.textColor),
			textAlign: resolveStyleReference(style.textAlign, parentStyles?.textAlign),
			borderRadius: resolveStyleReference(style.borderRadius, parentStyles?.borderRadius),
			shadow: resolveStyleReference(style.shadow, parentStyles?.shadow)
		}
	};

	return resolvedNode;
}
