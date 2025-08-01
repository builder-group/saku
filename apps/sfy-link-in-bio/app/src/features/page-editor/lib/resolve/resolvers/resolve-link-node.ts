import { resolveStyleReference, TLinkNode } from '@repo/editor';
import { TResolvedLinkNode, TResolvedLinkVariant } from '../../../types';
import { TNodeResolveContext } from '../types';
import { resolveAsset } from './resolve-asset';
import { resolveColor } from './resolve-color';

export function resolveLinkNode(node: TLinkNode, cx: TNodeResolveContext): TResolvedLinkNode {
	const { content, style, ...rest } = node;
	const parentStyles = cx.resolved?.parentStyles;

	let variant: TResolvedLinkVariant;
	switch (content.variant.type) {
		case 'default': {
			variant = {
				type: 'default' as const,
				title: content.variant.userTitle ?? content.variant.title,
				description: content.variant.userDescription ?? content.variant.description,
				favicon: resolveAsset(content.variant.userFavicon ?? content.variant.favicon, cx.site)
			};
			break;
		}
		case 'youtube':
			// TODO:
			variant = null as any;
			break;
		default:
		// do nothing
	}

	return {
		...rest,
		content: {
			url: content.url,
			variant
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
}
