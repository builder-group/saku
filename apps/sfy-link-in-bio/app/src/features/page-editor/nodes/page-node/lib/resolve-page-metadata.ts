import { TAboutNode, TFlatPageNode } from '@repo/editor';
import { resolveAsset, TNodeResolveContext } from '../../../lib';

export function resolvePageMetadata(
	node: TFlatPageNode,
	cx: TNodeResolveContext
): {
	title: string;
	description: string;
	favicon: string;
	image?: string;
} {
	let title: string | undefined;
	let description: string | undefined;
	let favicon: string | undefined;
	let image: string | undefined;

	// Use page metadata if available
	if (node.metadata?.title != null) {
		title = node.metadata.title;
	}
	if (node.metadata?.description != null) {
		description = node.metadata.description;
	}
	if (node.metadata?.favicon != null) {
		favicon = resolveAsset(node.metadata.favicon, cx.site)?.src;
	}
	if (node.metadata?.image != null) {
		image = resolveAsset(node.metadata.image, cx.site)?.src;
	}

	// If still undefined, try to extract from about node
	if (title == null || description == null || favicon == null) {
		const aboutNode = findAboutNode(node, cx);
		if (aboutNode != null) {
			if (title == null) {
				title = aboutNode.content.title;
			}
			if (description == null && aboutNode.content.description != null) {
				description = aboutNode.content.description;
			}
			if (favicon == null && aboutNode.content.avatar != null) {
				favicon = resolveAsset(aboutNode.content.avatar, cx.site)?.src;
			}
		}
	}

	// Crop favicon if it's hosted on Shopify CDN
	if (favicon != null && favicon.includes('cdn.shopify.com')) {
		const separator = favicon.includes('?') ? '&' : '?';
		favicon = `${favicon}${separator}crop=center&height=32&width=32`;
	}

	// Assign defaults if still undefined
	return {
		title: title ?? 'Link in Bio - Saku',
		description: description ?? 'Check out this link in bio page created with Saku',
		favicon: favicon ?? 'https://sfy-link-in-bio-app.saku.so/favicon.ico',
		image
	};
}

function findAboutNode(node: TFlatPageNode, cx: TNodeResolveContext): TAboutNode | null {
	for (const childId of node.children) {
		const childNode = cx.site.getNode(childId);
		if (childNode?.type === 'about') {
			return childNode as TAboutNode;
		}
	}
	return null;
}
