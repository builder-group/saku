import { Err, Ok, TResult } from '@blgc/utils';
import { TLinkNode } from '@repo/editor';
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
				videoId: content.variant.videoId
			};
			break;
		}
	}

	const resolveLayoutResult = resolveLayoutStyleMixin(layout, cx.childMixins?.layout);
	if (resolveLayoutResult.isErr()) {
		return Err(AppError.wrap(resolveLayoutResult.error, '#ERR_RESOLVE_LAYOUT_STYLE'));
	}
	const resolveAppearanceResult = resolveAppearanceStyleMixin(
		appearance,
		cx.childMixins?.appearance
	);
	if (resolveAppearanceResult.isErr()) {
		return Err(AppError.wrap(resolveAppearanceResult.error, '#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const resolveTypographyResult = resolveTypographyStyleMixin(
		typography,
		cx.childMixins?.typography
	);
	if (resolveTypographyResult.isErr()) {
		return Err(AppError.wrap(resolveTypographyResult.error, '#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}
	const resolveFillResult = resolveFillStyleMixin(fill, cx.site, cx.childMixins?.fill);
	if (resolveFillResult.isErr()) {
		return Err(AppError.wrap(resolveFillResult.error, '#ERR_RESOLVE_FILL_STYLE'));
	}
	const resolveStrokeResult = resolveStrokeStyleMixin(stroke, cx.childMixins?.stroke);
	if (resolveStrokeResult.isErr()) {
		return Err(AppError.wrap(resolveStrokeResult.error, '#ERR_RESOLVE_STROKE_STYLE'));
	}
	const resolveShadowResult = resolveShadowStyleMixin(shadow, cx.childMixins?.shadow);
	if (resolveShadowResult.isErr()) {
		return Err(AppError.wrap(resolveShadowResult.error, '#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			url: content.url,
			variant: resolvedVariant
		},
		layout: resolveLayoutResult.value,
		appearance: resolveAppearanceResult.value,
		typography: resolveTypographyResult.value,
		fill: resolveFillResult.value,
		stroke: resolveStrokeResult.value,
		shadow: resolveShadowResult.value
	});
}
