import { TClassicLinkNodeBundle } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError, computeInnerBorderRadius } from '@/lib';
import { TNodeResolveContext } from '../../../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveBasicLinkNodeContentMixin,
	resolveFillStyleMixin,
	resolveImageStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTextStyleMixin
} from '../../../../mixins';
import { TResolvedClassicLinkNodeBundle } from '../../types';

export function resolveClassicBundle(
	node: TClassicLinkNodeBundle,
	cx: TNodeResolveContext
): TResult<TResolvedClassicLinkNodeBundle, AppError> {
	const {
		content,
		autoLayout,
		appearance,
		fill,
		stroke,
		shadow,
		textBody,
		textCaption,
		image,
		...rest
	} = node;

	// Resolve content
	const [isResolvedContentOk, resolvedContentErr, resolvedContent] =
		resolveBasicLinkNodeContentMixin(content, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedContentOk) {
		return Err(resolvedContentErr.wrapWith('#ERR_RESOLVE_BASIC_LINK_NODE_CONTENT'));
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
	const [isResolvedTextCaptionOk, resolvedTextCaptionErr, resolvedTextCaption] =
		resolveTextStyleMixin(textCaption, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedTextCaptionOk) {
		return Err(resolvedTextCaptionErr.wrapWith('#ERR_RESOLVE_TEXT_CAPTION_STYLE'));
	}
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(image, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedImageOk) {
		return Err(resolvedImageErr.wrapWith('#ERR_RESOLVE_IMAGE_STYLE'));
	}

	const imageBorderRadius =
		resolvedImage.appearance.borderRadius ??
		computeInnerBorderRadius(
			resolvedAppearance.borderRadius ?? 0,
			Math.max(
				resolvedAutoLayout.paddingTop ?? 0,
				resolvedAutoLayout.paddingRight ?? 0,
				resolvedAutoLayout.paddingBottom ?? 0,
				resolvedAutoLayout.paddingLeft ?? 0
			)
		);

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		textBody: resolvedTextBody,
		textCaption: resolvedTextCaption,
		image: {
			...resolvedImage,
			appearance: {
				...resolvedImage.appearance,
				borderRadius: imageBorderRadius,
				styles: {
					...resolvedImage.appearance.styles,
					borderRadius: `${imageBorderRadius}px`
				}
			},
			styles: {
				...resolvedImage.styles,
				borderRadius: `${imageBorderRadius}px`
			}
		}
	});
}
