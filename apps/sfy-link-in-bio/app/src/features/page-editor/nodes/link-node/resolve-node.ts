import { TLinkNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveFillStyleMixin,
	resolveLayoutStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTypographyStyleMixin
} from '../../mixins';
import { TResolvedLinkNode, TResolvedLinkVariant } from './types';

export function resolveLinkNode(
	node: TLinkNode,
	cx: TNodeResolveContext
): TResult<TResolvedLinkNode, AppError> {
	const { content, layout, appearance, typography, fill, stroke, shadow, ...rest } = node;

	let resolvedVariant: TResolvedLinkVariant;
	switch (content.variant.type) {
		case 'default': {
			const favicon = content.variant.userFavicon ?? content.variant.favicon;
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

	const [isResolvedLayoutOk, resolvedLayoutErr, resolvedLayout] = resolveLayoutStyleMixin(
		layout,
		cx.childMixins?.layout
	);
	if (!isResolvedLayoutOk) {
		return Err(resolvedLayoutErr.wrapWith('#ERR_RESOLVE_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, cx.childMixins?.appearance);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedTypographyOk, resolvedTypographyErr, resolvedTypography] =
		resolveTypographyStyleMixin(typography, cx.childMixins?.typography);
	if (!isResolvedTypographyOk) {
		return Err(resolvedTypographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(
		fill,
		cx.site,
		cx.childMixins?.fill
	);
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		stroke,
		cx.childMixins?.stroke
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		shadow,
		cx.childMixins?.shadow
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			url: content.url,
			variant: resolvedVariant
		},
		layout: resolvedLayout,
		appearance: resolvedAppearance,
		typography: resolvedTypography,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow
	});
}
