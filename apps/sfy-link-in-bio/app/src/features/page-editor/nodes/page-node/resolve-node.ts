import { Err, Ok, TResult, unwrapOrNull } from '@blgc/utils';
import { getBestContrastColor, resolveReference, TAboutNode, TFlatPageNode } from '@repo/editor';
import { AppError } from '@/lib';
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

export function resolvePageNode(
	node: TFlatPageNode,
	cx: TNodeResolveContext
): TResult<TResolvedPageNode, AppError> {
	const resolvePageNodeWithoutChildrenResult = resolvePageNodeWithoutChildren(node, cx);
	if (resolvePageNodeWithoutChildrenResult.isErr()) {
		return Err(AppError.wrap(resolvePageNodeWithoutChildrenResult.error, '#ERR_RESOLVE_PAGE_NODE'));
	}

	return Ok({
		...resolvePageNodeWithoutChildrenResult.value,
		children: resolveFlatChildrenMixin(node.children, node, cx)
	});
}

export function resolvePageNodeWithoutChildren(
	node: TFlatPageNode,
	cx: TNodeResolveContext
): TResult<Omit<TResolvedPageNode, 'children'>, AppError> {
	const { layout, appearance, fill, childMixins: childDefaults, ...rest } = node;

	const resolvedFill = resolveReference(fill);
	const watermarkColor = resolveColor(
		getBestContrastColor(
			resolvedFill?.paint.type === 'solid'
				? resolvedFill.paint.color
				: { r: 255, g: 255, b: 255, a: 1 }
		)
	);

	const resolveAppearanceResult = resolveAppearanceStyleMixin(appearance);
	if (resolveAppearanceResult.isErr()) {
		return Err(AppError.wrap(resolveAppearanceResult.error, '#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const resolveFillResult = resolveFillStyleMixin(fill, cx.site);
	if (resolveFillResult.isErr()) {
		return Err(AppError.wrap(resolveFillResult.error, '#ERR_RESOLVE_FILL_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			metadata: resolvePageMetadata(node, cx)
		},
		layout,
		appearance: resolveAppearanceResult.value,
		fill: resolveFillResult.value,
		childMixins: {
			layout: unwrapOrNull(resolveLayoutStyleMixin(childDefaults.layout)) ?? undefined,
			appearance: unwrapOrNull(resolveAppearanceStyleMixin(childDefaults.appearance)) ?? undefined,
			typography: unwrapOrNull(resolveTypographyStyleMixin(childDefaults.typography)) ?? undefined,
			fill: unwrapOrNull(resolveFillStyleMixin(childDefaults.fill, cx.site)) ?? undefined,
			stroke: unwrapOrNull(resolveStrokeStyleMixin(childDefaults.stroke)) ?? undefined,
			shadow: unwrapOrNull(resolveShadowStyleMixin(childDefaults.shadow)) ?? undefined
		},
		watermarkColor
	});
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
