import { getBestContrastColor, resolveReference, TAboutNode, TFlatPageNode } from '@repo/editor';
import { Err, Ok, TResult, unwrapOrNull } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, resolveColor, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveButtonStyleMixin,
	resolveFillStyleMixin,
	resolveFlatChildrenMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTextStyleMixin
} from '../../mixins';
import { TResolvedPageNode } from './types';

export function resolvePageNode(
	node: TFlatPageNode,
	cx: TNodeResolveContext
): TResult<TResolvedPageNode, AppError> {
	const [
		isResolvedPageNodeWithoutChildrenOk,
		resolvedPageNodeWithoutChildrenErr,
		resolvedPageNodeWithoutChildren
	] = resolvePageNodeWithoutChildren(node, cx);
	if (!isResolvedPageNodeWithoutChildrenOk) {
		return Err(resolvedPageNodeWithoutChildrenErr.wrapWith('#ERR_RESOLVE_PAGE_NODE'));
	}

	return Ok({
		...resolvedPageNodeWithoutChildren,
		children: resolveFlatChildrenMixin(node.children, node, cx)
	});
}

export function resolvePageNodeWithoutChildren(
	node: TFlatPageNode,
	cx: TNodeResolveContext
): TResult<Omit<TResolvedPageNode, 'children'>, AppError> {
	const { autoLayout, appearance, fill, childMixins: childDefaults, ...rest } = node;

	const unreferencedFill = resolveReference(fill);
	const watermarkColor = resolveColor(
		getBestContrastColor(
			unreferencedFill?.paint.type === 'solid'
				? unreferencedFill.paint.color
				: { r: 255, g: 255, b: 255, a: 1 }
		)
	);

	const [isResolvedAutoLayoutOk, resolvedAutoLayoutErr, resolvedAutoLayout] =
		resolveAutoLayoutStyleMixin(autoLayout, cx);
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, cx);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(fill, cx);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			metadata: resolvePageMetadata(node, cx)
		},
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		childMixins: {
			autoLayout:
				unwrapOrNull(resolveAutoLayoutStyleMixin(childDefaults.autoLayout, cx)) ?? undefined,
			appearance:
				unwrapOrNull(resolveAppearanceStyleMixin(childDefaults.appearance, cx)) ?? undefined,
			fill: unwrapOrNull(resolveFillStyleMixin(childDefaults.fill, cx)) ?? undefined,
			stroke: unwrapOrNull(resolveStrokeStyleMixin(childDefaults.stroke, cx)) ?? undefined,
			shadow: unwrapOrNull(resolveShadowStyleMixin(childDefaults.shadow, cx)) ?? undefined,
			text: unwrapOrNull(resolveTextStyleMixin(childDefaults.text, cx)) ?? undefined,
			button: unwrapOrNull(resolveButtonStyleMixin(childDefaults.button, cx)) ?? undefined
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
		image = resolveAsset(node.content.metadata.image, cx.site)?.src;
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
