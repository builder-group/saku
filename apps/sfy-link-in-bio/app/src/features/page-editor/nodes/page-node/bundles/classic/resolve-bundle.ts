import { TClassicFlatPageNodeBundle } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveBasicPageNodeContentMixin,
	resolveFillStyleMixin,
	resolveFlatChildrenMixin,
	resolveTextStyleMixin
} from '../../../../mixins';
import { resolvePageMetadata } from '../../lib';
import { TResolvedClassicPageNodeBundle } from '../../types';

export function resolveClassicBundle(
	node: TClassicFlatPageNodeBundle,
	cx: TNodeResolveContext
): TResult<TResolvedClassicPageNodeBundle, AppError> {
	const [
		isResolvedPageNodeWithoutChildrenOk,
		resolvedPageNodeWithoutChildrenErr,
		resolvedPageNodeWithoutChildren
	] = resolveClassicBundleWithoutChildren(node, cx);
	if (!isResolvedPageNodeWithoutChildrenOk) {
		return Err(resolvedPageNodeWithoutChildrenErr.wrapWith('#ERR_RESOLVE_PAGE_NODE'));
	}

	return Ok({
		...resolvedPageNodeWithoutChildren,
		children: resolveFlatChildrenMixin(node.children, node, cx)
	});
}

export function resolveClassicBundleWithoutChildren(
	node: TClassicFlatPageNodeBundle,
	cx: TNodeResolveContext
): TResult<Omit<TResolvedClassicPageNodeBundle, 'children'>, AppError> {
	const { content, autoLayout, appearance, fill, textSm, ...rest } = node;

	// Resolve content
	const [isResolvedContentOk, resolvedContentErr, resolvedContent] =
		resolveBasicPageNodeContentMixin(content, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedContentOk) {
		return Err(resolvedContentErr.wrapWith('#ERR_RESOLVE_BASIC_PAGE_NODE_CONTENT'));
	}

	// Resolve styles
	const [isResolvedAutoLayoutOk, resolvedAutoLayoutErr, resolvedAutoLayout] =
		resolveAutoLayoutStyleMixin(autoLayout, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(fill, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedTextSmOk, resolvedTextSmErr, resolvedTextSm] = resolveTextStyleMixin(textSm, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedTextSmOk) {
		return Err(resolvedTextSmErr.wrapWith('#ERR_RESOLVE_TEXT_SM_STYLE'));
	}

	return Ok({
		...rest,
		content: resolvedContent,
		metadata: resolvePageMetadata(node, cx),
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		textSm: resolvedTextSm
	});
}
