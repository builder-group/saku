import {
	TAboutNode,
	TAsset,
	TAssetHash,
	TLinkNode,
	TMediaNode,
	TNode,
	TPageNode,
	TResolvedAboutNode,
	TResolvedLinkNode,
	TResolvedMediaNode,
	TResolvedPageNode,
	TResolvedSite,
	TResolvedTextNode,
	TSite,
	TStyleReference,
	TTextNode
} from '../types';

/**
 * Resolve a complete site with all nodes and style inheritance
 */
export function resolveSite(site: TSite): TResolvedSite {
	const assetsMap = site.assets.reduce(
		(map, asset) => {
			map[asset.hash] = asset;
			return map;
		},
		{} as Record<TAssetHash, TAsset>
	);

	return {
		...site,
		root: resolvePageNode(site.root, assetsMap)
	};
}

export function resolvePageNode(
	node: TPageNode,
	assetsMap: Record<TAssetHash, TAsset>
): TResolvedPageNode {
	return {
		...node,
		style: {
			backgroundColor: resolveStyle(node.style.backgroundColor),
			children: node.style.children
				? {
						backgroundColor: resolveStyle(node.style.children.backgroundColor),
						spacing: resolveStyle(node.style.children.spacing),
						padding: resolveStyle(node.style.children.padding),
						margin: resolveStyle(node.style.children.margin),
						font: resolveStyle(node.style.children.font),
						fontSize: resolveStyle(node.style.children.fontSize),
						textColor: resolveStyle(node.style.children.textColor),
						textAlign: resolveStyle(node.style.children.textAlign),
						borderRadius: resolveStyle(node.style.children.borderRadius),
						shadow: resolveStyle(node.style.children.shadow)
					}
				: undefined
		},
		children: node.children.map((child) => resolveChildNode(child, assetsMap, node.style.children))
	};
}

export function resolveAboutNode(
	node: TAboutNode,
	assetsMap: Record<TAssetHash, TAsset>,
	defaultStyles?: TPageNode['style']['children']
): TResolvedAboutNode {
	return {
		...node,
		profilePicture: resolveAsset(node.profilePicture, assetsMap),
		style: {
			padding: resolveStyle(node.style.padding, defaultStyles?.padding),
			margin: resolveStyle(node.style.margin, defaultStyles?.margin),
			backgroundColor: resolveStyle(node.style.backgroundColor, defaultStyles?.backgroundColor),
			font: resolveStyle(node.style.font, defaultStyles?.font),
			fontSize: resolveStyle(node.style.fontSize, defaultStyles?.fontSize),
			textColor: resolveStyle(node.style.textColor, defaultStyles?.textColor),
			textAlign: resolveStyle(node.style.textAlign, defaultStyles?.textAlign),
			borderRadius: resolveStyle(node.style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyle(node.style.shadow, defaultStyles?.shadow)
		}
	};
}

export function resolveLinkNode(
	node: TLinkNode,
	assetsMap: Record<TAssetHash, TAsset>,
	defaultStyles?: TPageNode['style']['children']
): TResolvedLinkNode {
	return {
		...node,
		meta: {
			title: node.meta.title,
			description: node.meta.description,
			favicon: resolveAsset(node.meta.favicon, assetsMap)
		},
		fetchedMeta: node.fetchedMeta
			? {
					title: node.fetchedMeta.title,
					description: node.fetchedMeta.description,
					favicon: resolveAsset(node.fetchedMeta.favicon, assetsMap)
				}
			: undefined,
		style: {
			padding: resolveStyle(node.style.padding, defaultStyles?.padding),
			margin: resolveStyle(node.style.margin, defaultStyles?.margin),
			backgroundColor: resolveStyle(node.style.backgroundColor, defaultStyles?.backgroundColor),
			font: resolveStyle(node.style.font, defaultStyles?.font),
			fontSize: resolveStyle(node.style.fontSize, defaultStyles?.fontSize),
			textColor: resolveStyle(node.style.textColor, defaultStyles?.textColor),
			textAlign: resolveStyle(node.style.textAlign, defaultStyles?.textAlign),
			borderRadius: resolveStyle(node.style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyle(node.style.shadow, defaultStyles?.shadow)
		}
	};
}

export function resolveMediaNode(
	node: TMediaNode,
	assetsMap: Record<TAssetHash, TAsset>,
	defaultStyles?: TPageNode['style']['children']
): TResolvedMediaNode {
	return {
		...node,
		media: {
			type: node.media.type,
			url: resolveAsset(node.media.hash, assetsMap) ?? '',
			altText: node.media.altText
		},
		style: {
			padding: resolveStyle(node.style.padding, defaultStyles?.padding),
			margin: resolveStyle(node.style.margin, defaultStyles?.margin),
			backgroundColor: resolveStyle(node.style.backgroundColor, defaultStyles?.backgroundColor),
			borderRadius: resolveStyle(node.style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyle(node.style.shadow, defaultStyles?.shadow)
		}
	};
}

export function resolveTextNode(
	node: TTextNode,
	defaultStyles?: TPageNode['style']['children']
): TResolvedTextNode {
	return {
		...node,
		style: {
			padding: resolveStyle(node.style.padding, defaultStyles?.padding),
			margin: resolveStyle(node.style.margin, defaultStyles?.margin),
			backgroundColor: resolveStyle(node.style.backgroundColor, defaultStyles?.backgroundColor),
			font: resolveStyle(node.style.font, defaultStyles?.font),
			fontSize: resolveStyle(node.style.fontSize, defaultStyles?.fontSize),
			textColor: resolveStyle(node.style.textColor, defaultStyles?.textColor),
			textAlign: resolveStyle(node.style.textAlign, defaultStyles?.textAlign),
			borderRadius: resolveStyle(node.style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyle(node.style.shadow, defaultStyles?.shadow)
		}
	};
}

function resolveChildNode(
	node: TNode,
	assetsMap: Record<TAssetHash, TAsset>,
	defaultStyles?: TPageNode['style']['children']
) {
	switch (node.type) {
		case 'about':
			return resolveAboutNode(node, assetsMap, defaultStyles);
		case 'link':
			return resolveLinkNode(node, assetsMap, defaultStyles);
		case 'media':
			return resolveMediaNode(node, assetsMap, defaultStyles);
		case 'text':
			return resolveTextNode(node, defaultStyles);
		default:
			throw new Error(`Unknown node type: ${(node as any).type}`);
	}
}

function resolveAsset(
	hash: TAssetHash | undefined,
	assetsMap: Record<TAssetHash, TAsset>
): string | undefined {
	if (!hash) {
		return undefined;
	}

	const asset = assetsMap[hash];
	if (!asset) {
		return undefined;
	}

	if (asset.storage.type === 'url') {
		return asset.storage.url;
	}

	if (asset.storage.type === 'embedded') {
		return asset.storage.data; // base64
	}

	return undefined;
}

export function resolveStyle<T>(value: TStyleReference<T>, fallback?: T): T | undefined {
	if (value === 'inherit') {
		return fallback;
	}
	return value;
}
