import {
	TAboutNode,
	TLinkNode,
	TMediaNode,
	TNode,
	TPageNode,
	TResolvedPageNode,
	TResolvedSite,
	TSite,
	TStyleReference,
	TTextNode,
	TWithResolvedStyles
} from '@/features/page-editor';

/**
 * Resolve a style reference using inheritance fallback
 */
function resolveStyle<T>(value: TStyleReference<T>, fallback?: T): T | undefined {
	if (value === 'inherit') return fallback;
	return value ?? fallback;
}

/**
 * Resolve a complete site with all nodes and style inheritance
 */
export function resolveSite(site: TSite): TResolvedSite {
	return {
		...site,
		root: resolvePageNode(site.root)
	};
}

/**
 * Resolve a page node and all its children
 */
export function resolvePageNode(pageNode: TPageNode): TResolvedPageNode {
	return {
		...pageNode,
		style: {
			backgroundColor: resolveStyle(pageNode.style.backgroundColor),
			children: pageNode.style.children
				? {
						backgroundColor: resolveStyle(pageNode.style.children.backgroundColor),
						spacing: resolveStyle(pageNode.style.children.spacing),
						padding: resolveStyle(pageNode.style.children.padding),
						margin: resolveStyle(pageNode.style.children.margin),
						fontFamily: resolveStyle(pageNode.style.children.fontFamily),
						fontSize: resolveStyle(pageNode.style.children.fontSize),
						textColor: resolveStyle(pageNode.style.children.textColor),
						textAlign: resolveStyle(pageNode.style.children.textAlign),
						borderRadius: resolveStyle(pageNode.style.children.borderRadius),
						shadow: resolveStyle(pageNode.style.children.shadow)
					}
				: undefined
		},
		children: pageNode.children.map((child) => resolveNode(child, pageNode))
	};
}

/**
 * Generic node resolver with typesafe return types
 */
export function resolveNode<T extends TNode>(
	node: T,
	pageNode?: TPageNode
): TWithResolvedStyles<T> {
	const defaults = pageNode?.style.children;

	switch (node.type) {
		case 'page':
			return resolvePageNode(node as TPageNode) as TWithResolvedStyles<T>;

		case 'about': {
			const aboutNode = node as TAboutNode;
			return {
				...aboutNode,
				style: {
					padding: resolveStyle(aboutNode.style.padding, defaults?.padding),
					margin: resolveStyle(aboutNode.style.margin, defaults?.margin),
					backgroundColor: resolveStyle(aboutNode.style.backgroundColor, defaults?.backgroundColor),
					fontFamily: resolveStyle(aboutNode.style.fontFamily, defaults?.fontFamily),
					fontSize: resolveStyle(aboutNode.style.fontSize, defaults?.fontSize),
					textColor: resolveStyle(aboutNode.style.textColor, defaults?.textColor),
					textAlign: resolveStyle(aboutNode.style.textAlign, defaults?.textAlign),
					borderRadius: resolveStyle(aboutNode.style.borderRadius, defaults?.borderRadius),
					shadow: resolveStyle(aboutNode.style.shadow, defaults?.shadow)
				}
			} as TWithResolvedStyles<T>;
		}

		case 'link': {
			const linkNode = node as TLinkNode;
			return {
				...linkNode,
				style: {
					padding: resolveStyle(linkNode.style.padding, defaults?.padding),
					margin: resolveStyle(linkNode.style.margin, defaults?.margin),
					backgroundColor: resolveStyle(linkNode.style.backgroundColor, defaults?.backgroundColor),
					fontFamily: resolveStyle(linkNode.style.fontFamily, defaults?.fontFamily),
					fontSize: resolveStyle(linkNode.style.fontSize, defaults?.fontSize),
					textColor: resolveStyle(linkNode.style.textColor, defaults?.textColor),
					textAlign: resolveStyle(linkNode.style.textAlign, defaults?.textAlign),
					borderRadius: resolveStyle(linkNode.style.borderRadius, defaults?.borderRadius),
					shadow: resolveStyle(linkNode.style.shadow, defaults?.shadow)
				}
			} as TWithResolvedStyles<T>;
		}

		case 'media': {
			const mediaNode = node as TMediaNode;
			return {
				...mediaNode,
				style: {
					padding: resolveStyle(mediaNode.style.padding, defaults?.padding),
					margin: resolveStyle(mediaNode.style.margin, defaults?.margin),
					backgroundColor: resolveStyle(mediaNode.style.backgroundColor, defaults?.backgroundColor),
					borderRadius: resolveStyle(mediaNode.style.borderRadius, defaults?.borderRadius),
					shadow: resolveStyle(mediaNode.style.shadow, defaults?.shadow)
				}
			} as TWithResolvedStyles<T>;
		}

		case 'text': {
			const textNode = node as TTextNode;
			return {
				...textNode,
				style: {
					padding: resolveStyle(textNode.style.padding, defaults?.padding),
					margin: resolveStyle(textNode.style.margin, defaults?.margin),
					backgroundColor: resolveStyle(textNode.style.backgroundColor, defaults?.backgroundColor),
					fontFamily: resolveStyle(textNode.style.fontFamily, defaults?.fontFamily),
					fontSize: resolveStyle(textNode.style.fontSize, defaults?.fontSize),
					textColor: resolveStyle(textNode.style.textColor, defaults?.textColor),
					textAlign: resolveStyle(textNode.style.textAlign, defaults?.textAlign),
					borderRadius: resolveStyle(textNode.style.borderRadius, defaults?.borderRadius),
					shadow: resolveStyle(textNode.style.shadow, defaults?.shadow)
				}
			} as TWithResolvedStyles<T>;
		}

		default:
			throw new Error(`Unknown node type: ${(node as any).type}`);
	}
}

/**
 * Extract font URLs from a site's assets for static rendering
 */
export function extractSiteFontUrls(site: TSite): string[] {
	return site.assets
		.filter((asset) => asset.type === 'font' && asset.content.type === 'url')
		.map((asset) => {
			if (asset.content.type === 'url') {
				return asset.content.url;
			}
			return '';
		})
		.filter(Boolean);
}
