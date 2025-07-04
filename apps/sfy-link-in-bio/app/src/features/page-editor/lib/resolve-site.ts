import {
	resolveStyleReference,
	rgbaToCssRgba,
	TAboutNode,
	TAsset,
	TAssetHash,
	TLinkNode,
	TMediaNode,
	TNode,
	TPageNode,
	TRgba,
	TSite,
	TStyleReference,
	TTextNode
} from '@repo/editor';
import {
	TResolvedAboutNode,
	TResolvedLinkNode,
	TResolvedMediaNode,
	TResolvedPageNode,
	TResolvedSite,
	TResolvedTextNode
} from '../types';
import { TFlattenedNode } from './flatten-node';

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
		...resolvePageNodeWithoutChildren(node),
		children: node.children.map((child) => resolveChildNode(child, assetsMap, node.style.children))
	};
}

export function resolvePageNodeWithoutChildren(
	node: TPageNode | TFlattenedNode<TPageNode>
): Omit<TResolvedPageNode, 'children'> {
	return {
		...node,
		style: {
			backgroundColor: resolveColor(node.style.backgroundColor),
			children: node.style.children
				? {
						backgroundColor: resolveColor(node.style.children.backgroundColor),
						spacing: resolveStyleReference(node.style.children.spacing),
						padding: resolveStyleReference(node.style.children.padding),
						font: resolveStyleReference(node.style.children.font),
						fontSize: resolveStyleReference(node.style.children.fontSize),
						textColor: resolveColor(node.style.children.textColor),
						textAlign: resolveStyleReference(node.style.children.textAlign),
						borderRadius: resolveStyleReference(node.style.children.borderRadius),
						shadow: resolveStyleReference(node.style.children.shadow)
					}
				: undefined
		}
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
			padding: resolveStyleReference(node.style.padding, defaultStyles?.padding),
			backgroundColor: resolveColor(node.style.backgroundColor, defaultStyles?.backgroundColor),
			font: resolveStyleReference(node.style.font, defaultStyles?.font),
			fontSize: resolveStyleReference(node.style.fontSize, defaultStyles?.fontSize),
			textColor: resolveColor(node.style.textColor, defaultStyles?.textColor),
			textAlign: resolveStyleReference(node.style.textAlign, defaultStyles?.textAlign),
			borderRadius: resolveStyleReference(node.style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyleReference(node.style.shadow, defaultStyles?.shadow)
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
			padding: resolveStyleReference(node.style.padding, defaultStyles?.padding),
			backgroundColor: resolveColor(node.style.backgroundColor, defaultStyles?.backgroundColor),
			font: resolveStyleReference(node.style.font, defaultStyles?.font),
			fontSize: resolveStyleReference(node.style.fontSize, defaultStyles?.fontSize),
			textColor: resolveColor(node.style.textColor, defaultStyles?.textColor),
			textAlign: resolveStyleReference(node.style.textAlign, defaultStyles?.textAlign),
			borderRadius: resolveStyleReference(node.style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyleReference(node.style.shadow, defaultStyles?.shadow)
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
			padding: resolveStyleReference(node.style.padding, defaultStyles?.padding),
			backgroundColor: resolveColor(node.style.backgroundColor, defaultStyles?.backgroundColor),
			borderRadius: resolveStyleReference(node.style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyleReference(node.style.shadow, defaultStyles?.shadow)
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
			padding: resolveStyleReference(node.style.padding, defaultStyles?.padding),
			backgroundColor: resolveColor(node.style.backgroundColor, defaultStyles?.backgroundColor),
			font: resolveStyleReference(node.style.font, defaultStyles?.font),
			fontSize: resolveStyleReference(node.style.fontSize, defaultStyles?.fontSize),
			textColor: resolveColor(node.style.textColor, defaultStyles?.textColor),
			textAlign: resolveStyleReference(node.style.textAlign, defaultStyles?.textAlign),
			borderRadius: resolveStyleReference(node.style.borderRadius, defaultStyles?.borderRadius),
			shadow: resolveStyleReference(node.style.shadow, defaultStyles?.shadow)
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

export function resolveColor(
	value: TStyleReference<TRgba> | undefined,
	fallback?: TRgba
): string | undefined {
	if (value == null) {
		return undefined;
	}
	const color = resolveStyleReference(value, fallback);
	return color != null ? rgbaToCssRgba(color) : undefined;
}
