import { TLinkNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveFillStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTextStyleMixin
} from '../../mixins';
import { TResolvedLinkNode, TResolvedLinkVariant } from './types';

export function resolveLinkNode(
	node: TLinkNode,
	cx: TNodeResolveContext
): TResult<TResolvedLinkNode, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, text, ...rest } = node;

	let resolvedVariant: TResolvedLinkVariant;
	switch (content.variant.type) {
		case 'default': {
			const favicon =
				content.variant.userFavicon !== undefined
					? content.variant.userFavicon
					: content.variant.favicon;
			resolvedVariant = {
				type: 'default',
				title: content.variant.userTitle ?? content.variant.title,
				description: content.variant.userDescription ?? content.variant.description,
				favicon: favicon != null ? resolveAsset(favicon, cx.site) : undefined
			};
			break;
		}
		// case 'youtube-video': {
		// 	variant = {
		// 		type: 'youtube-video',
		// 		title: content.variant.userTitle ?? content.variant.title
		// 	};
		// 	break;
		// }
		// case 'youtube-channel': {
		// 	variant = {
		// 		type: 'youtube-channel',
		// 		title: content.variant.userTitle ?? content.variant.title
		// 	};
		// 	break;
		// }
		case 'youtube-video-embed': {
			resolvedVariant = {
				type: 'youtube-video-embed',
				embedUrl: `https://www.youtube.com/embed/${content.variant.videoId}`
			};
			break;
		}
	}

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
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		stroke,
		cx
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		shadow,
		cx
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(text, cx);
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			url: content.url,
			variant: resolvedVariant
		},
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		text: resolvedText
	});
}
