import { getBestContrastColor, resolveReference, TAboutNode, TFlatPageNode } from '@repo/editor';
import { resolveAsset, resolveColor, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveFillStyleMixin,
	resolveFlatChildrenMixin,
	resolveLayoutStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTypographyStyleMixin
} from '../../mixins';
import { TResolvedPageNode } from './types';

export function resolvePageNode(node: TFlatPageNode, cx: TNodeResolveContext): TResolvedPageNode {
	return {
		...resolvePageNodeWithoutChildren(node, cx),
		children: resolveFlatChildrenMixin(node.children, node, cx)
	};
}

export function resolvePageNodeWithoutChildren(
	node: TFlatPageNode,
	cx: TNodeResolveContext
): Omit<TResolvedPageNode, 'children'> {
	const { layout, appearance, fill, childMixins: childDefaults, ...rest } = node;

	const resolvedFill = resolveReference(fill);
	const watermarkColor = resolveColor(
		getBestContrastColor(
			resolvedFill?.paint.type === 'solid'
				? resolvedFill.paint.color
				: { r: 255, g: 255, b: 255, a: 1 }
		)
	);

	return {
		...rest,
		content: {
			metadata: resolvePageMetadata(node, cx)
		},
		layout,
		appearance: resolveAppearanceStyleMixin(appearance),
		fill: resolveFillStyleMixin(fill, cx.site),
		childDefaults: {
			layout: resolveLayoutStyleMixin(childDefaults.layout),
			appearance: resolveAppearanceStyleMixin(childDefaults.appearance),
			typography: resolveTypographyStyleMixin(childDefaults.typography),
			fill: resolveFillStyleMixin(childDefaults.fill, cx.site),
			stroke: resolveStrokeStyleMixin(childDefaults.stroke),
			shadow: resolveShadowStyleMixin(childDefaults.shadow)
		},
		watermarkColor
	};
}

function resolvePageMetadata(
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
