import { notEmpty } from '@blgc/utils';
import {
	getBestContrastColor,
	resolveStyleReference,
	TAboutNode,
	TFlatNode,
	TFlatPageNode
} from '@repo/editor';
import { resolveAsset, resolveColor, TNodeResolveContext } from '../../lib';
import { TResolvedNode, TResolvedPageNode } from '../../types';
import { resolveAboutNode } from '../about-node';
import { resolveLinkNode } from '../link-node';
import { resolveMediaNode } from '../media-node';
import { resolveProductNode } from '../product-node';
import { resolveTextNode } from '../text-node';

export function resolvePageNode(node: TFlatPageNode, cx: TNodeResolveContext): TResolvedPageNode {
	return {
		...resolvePageNodeWithoutChildren(node, cx),
		children: node.children
			.map((childId) => {
				const childNode = cx.site.getNode(childId);
				if (childNode == null) {
					return null;
				}
				return resolvePageNodeChild(childNode, {
					site: cx.site,
					parentId: node.id,
					resolved: {
						parentStyles: node.style.children
					}
				});
			})
			.filter(notEmpty)
	};
}

export function resolvePageNodeWithoutChildren(
	node: TFlatPageNode,
	cx: TNodeResolveContext
): Omit<TResolvedPageNode, 'children'> {
	const { style, ...rest } = node;

	return {
		...rest,
		content: {
			metadata: extractPageMetadata(node, cx)
		},
		style: {
			backgroundColor: resolveColor(style.backgroundColor),
			watermarkColor: resolveColor(
				getBestContrastColor(style.backgroundColor ?? { r: 255, g: 255, b: 255, a: 1 })
			) as string,
			children: {
				backgroundColor: resolveColor(style.children.backgroundColor),
				spacing: resolveStyleReference(style.children.spacing),
				padding: resolveStyleReference(style.children.padding),
				font: resolveStyleReference(style.children.font),
				fontSize: resolveStyleReference(style.children.fontSize),
				textColor: resolveColor(style.children.textColor),
				textAlign: resolveStyleReference(style.children.textAlign),
				borderRadius: resolveStyleReference(style.children.borderRadius),
				shadow: resolveStyleReference(style.children.shadow)
			}
		}
	};
}

export function resolvePageNodeChild(
	node: TFlatNode,
	cx: TNodeResolveContext
): TResolvedNode | null {
	switch (node.type) {
		case 'about':
			return resolveAboutNode(node, cx);
		case 'link':
			return resolveLinkNode(node, cx);
		case 'media':
			return resolveMediaNode(node, cx);
		case 'text':
			return resolveTextNode(node, cx);
		case 'product':
			return resolveProductNode(node, cx);
		default:
			return null;
	}
}

function extractPageMetadata(
	node: TFlatPageNode,
	cx: TNodeResolveContext
): {
	title: string;
	description: string;
	image?: string;
} {
	let title: string | undefined;
	let description: string | undefined;
	let image: string | undefined;

	// Use page metadata if available
	if (node.content.metadata?.title != null) {
		title = node.content.metadata.title;
	}
	if (node.content.metadata?.description != null) {
		description = node.content.metadata.description;
	}
	if (node.content.metadata?.image != null) {
		image = resolveAsset(node.content.metadata.image, cx.site);
	}

	// If still undefined, try to extract from about node
	if (title == null || description == null) {
		const aboutNode = findAboutNode(node, cx);
		if (aboutNode != null) {
			if (title == null) {
				title = aboutNode.content.name;
			}
			if (description == null && aboutNode.content.bio != null) {
				description = aboutNode.content.bio;
			}
		}
	}

	// Assign defaults if still undefined
	return {
		title: title ?? 'Link in Bio - Saku',
		description: description ?? 'Check out this link in bio page created with Saku',
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
