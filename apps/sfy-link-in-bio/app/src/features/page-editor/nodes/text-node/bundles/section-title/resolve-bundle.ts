import { TSectionTitleTextNodeBundle } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveBasicTextNodeContentMixin,
	resolveTextStyleMixin
} from '../../../../mixins';
import { TResolvedSectionTitleTextNodeBundle } from '../../types';

export function resolveSectionTitleBundle(
	node: TSectionTitleTextNodeBundle,
	cx: TNodeResolveContext
): TResult<TResolvedSectionTitleTextNodeBundle, AppError> {
	const { content, autoLayout, appearance, textXl, ...rest } = node;

	// Resolve content
	const [isResolvedContentOk, resolvedContentErr, resolvedContent] =
		resolveBasicTextNodeContentMixin(content, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedContentOk) {
		return Err(resolvedContentErr.wrapWith('#ERR_RESOLVE_RICH_TEXT_NODE_CONTENT'));
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
	const [isResolvedTextXlOk, resolvedTextXlErr, resolvedTextXl] = resolveTextStyleMixin(textXl, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedTextXlOk) {
		return Err(resolvedTextXlErr.wrapWith('#ERR_RESOLVE_TEXT_XL_STYLE'));
	}

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		textXl: resolvedTextXl
	});
}
