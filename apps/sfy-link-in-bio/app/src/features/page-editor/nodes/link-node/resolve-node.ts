import { TLinkNode } from '@repo/editor';
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
import { TResolvedLinkNode, TResolvedLinkNodeContent } from './types';

export function resolveLinkNode(
	node: TLinkNode,
	cx: TNodeResolveContext
): TResult<TResolvedLinkNode, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, text, smText, image, ...rest } =
		node;

	// Resolve content
	let resolvedContent: TResolvedLinkNodeContent;
	switch (content.type) {
		case 'single': {
			const favicon = content.userFavicon !== undefined ? content.userFavicon : content.favicon;
			resolvedContent = {
				type: 'single',
				url: content.url,
				title: content.userTitle ?? content.title,
				description: content.userDescription ?? content.description,
				favicon: favicon != null ? resolveAsset(favicon, cx.site) : undefined
			};
			break;
		}
		case 'youtube-video-embed': {
			resolvedContent = {
				type: 'youtube-video-embed',
				url: content.url,
				embedUrl: `https://www.youtube.com/embed/${content.videoId}`
			};
			break;
		}
	}

	// Resolve styles
	const [isResolvedAutoLayoutOk, resolvedAutoLayoutErr, resolvedAutoLayout] =
		resolveAutoLayoutStyleMixin(autoLayout, {
			node: cx,
			mixinTokenSet: cx.site.getMixinTokenSet('autoLayout'),
			mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
			variableTokenMap: cx.site.getVariableTokenMap()
		});
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, {
			node: cx,
			mixinTokenSet: cx.site.getMixinTokenSet('appearance'),
			mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
			variableTokenMap: cx.site.getVariableTokenMap()
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(fill, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('fill'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(stroke, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('stroke'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(shadow, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('shadow'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(text, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('text'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}
	const [isResolvedSmTextOk, resolvedSmTextErr, resolvedSmText] = resolveTextStyleMixin(smText, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('text'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
	});
	if (!isResolvedSmTextOk) {
		return Err(resolvedSmTextErr.wrapWith('#ERR_RESOLVE_SM_TEXT_STYLE'));
	}
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(image, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('image'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
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
		text: resolvedText,
		smText: resolvedSmText,
		image: resolvedImage
	});
}
