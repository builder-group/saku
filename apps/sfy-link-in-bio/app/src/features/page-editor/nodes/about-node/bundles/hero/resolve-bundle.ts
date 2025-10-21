import { THeroAboutNodeBundle } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveBasicAboutNodeContentMixin,
	resolveFillStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTextStyleMixin
} from '../../../../mixins';
import { TResolvedHeroAboutNodeBundle } from '../../types';

export function resolveHeroBundle(
	node: THeroAboutNodeBundle,
	cx: TNodeResolveContext
): TResult<TResolvedHeroAboutNodeBundle, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, textHeading, textBody, ...rest } =
		node;

	// Resolve content
	const [isResolvedContentOk, resolvedContentErr, resolvedContent] =
		resolveBasicAboutNodeContentMixin(content, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedContentOk) {
		return Err(resolvedContentErr.wrapWith('#ERR_RESOLVE_BASIC_ABOUT_NODE_CONTENT'));
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
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(stroke, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(shadow, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextHeadingOk, resolvedTextHeadingErr, resolvedTextHeading] =
		resolveTextStyleMixin(textHeading, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedTextHeadingOk) {
		return Err(resolvedTextHeadingErr.wrapWith('#ERR_RESOLVE_TEXT_HEADING_STYLE'));
	}
	const [isResolvedTextBodyOk, resolvedTextBodyErr, resolvedTextBody] = resolveTextStyleMixin(
		textBody,
		{
			node: cx,
			tokenMap: cx.site.getTokenMap()
		}
	);
	if (!isResolvedTextBodyOk) {
		return Err(resolvedTextBodyErr.wrapWith('#ERR_RESOLVE_TEXT_BODY_STYLE'));
	}

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		textHeading: resolvedTextHeading,
		textBody: resolvedTextBody
	});
}
