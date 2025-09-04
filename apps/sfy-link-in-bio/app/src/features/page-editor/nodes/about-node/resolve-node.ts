import { TAboutNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveFillStyleMixin,
	resolveImageStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTextStyleMixin
} from '../../mixins';
import { TResolvedAboutNode, TResolvedAboutNodeContent } from './types';

export function resolveAboutNode(
	node: TAboutNode,
	cx: TNodeResolveContext
): TResult<TResolvedAboutNode, AppError> {
	const {
		content,
		autoLayout,
		appearance,
		fill,
		stroke,
		shadow,
		headingText,
		text,
		image,
		...rest
	} = node;

	// Resolve content
	let resolvedContent: TResolvedAboutNodeContent;
	switch (content.type) {
		case 'default': {
			resolvedContent = {
				...content,
				profilePicture:
					content.profilePicture != null ? resolveAsset(content.profilePicture, cx.site) : undefined
			};
		}
	}

	// Resolve styles
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
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(stroke, {
		node: cx,
		tokenSet: cx.site.getTokenSet('stroke'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
	});
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(shadow, {
		node: cx,
		tokenSet: cx.site.getTokenSet('shadow'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
	});
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedHeadingTextOk, resolvedHeadingTextErr, resolvedHeadingText] =
		resolveTextStyleMixin(headingText, {
			node: cx,
			tokenSet: cx.site.getTokenSet('text'),
			mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
		});
	if (!isResolvedHeadingTextOk) {
		return Err(resolvedHeadingTextErr.wrapWith('#ERR_RESOLVE_HEADING_TEXT_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(text, {
		node: cx,
		tokenSet: cx.site.getTokenSet('text'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
	});
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(image, {
		node: cx,
		tokenSet: cx.site.getTokenSet('image'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]?.value
	});
	if (!isResolvedImageOk) {
		return Err(resolvedImageErr.wrapWith('#ERR_RESOLVE_IMAGE_STYLE'));
	}

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		headingText: resolvedHeadingText,
		text: resolvedText,
		image: resolvedImage
	});
}
