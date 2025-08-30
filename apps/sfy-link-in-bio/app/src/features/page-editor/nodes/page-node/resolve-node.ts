import { TAboutNode, TFlatPageNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveFillStyleMixin,
	resolveFlatChildrenMixin
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
	const { autoLayout, appearance, fill, ...rest } = node;

	const [isResolvedAutoLayoutOk, resolvedAutoLayoutErr, resolvedAutoLayout] =
		resolveAutoLayoutStyleMixin(autoLayout, {
			node: cx,
			tokenSet: cx.site.getTokenSet('autoLayout'),
			mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
		});
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, {
			node: cx,
			tokenSet: cx.site.getTokenSet('appearance'),
			mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(fill, {
		node: cx,
		tokenSet: cx.site.getTokenSet('fill'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
	});
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
		fill: resolvedFill
	});
}

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
	if (node.content.metadata?.title != null) {
		title = node.content.metadata.title;
	}
	if (node.content.metadata?.description != null) {
		description = node.content.metadata.description;
	}
	if (node.content.metadata?.favicon != null) {
		favicon = resolveAsset(node.content.metadata.favicon, cx.site)?.src;
	}
	if (node.content.metadata?.image != null) {
		image = resolveAsset(node.content.metadata.image, cx.site)?.src;
	}

	// If still undefined, try to extract from about node
	if (title == null || description == null || favicon == null) {
		const aboutNode = findAboutNode(node, cx);
		if (aboutNode != null) {
			if (title == null) {
				title = aboutNode.content.name;
			}
			if (description == null && aboutNode.content.bio != null) {
				description = aboutNode.content.bio;
			}
			if (favicon == null && aboutNode.content.profilePicture != null) {
				const src = resolveAsset(aboutNode.content.profilePicture, cx.site)?.src;
				if (src != null) {
					const separator = src.includes('?') ? '&' : '?';
					favicon = `${src}${separator}crop=center&height=32&width=32`;
				}
			}
		}
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
