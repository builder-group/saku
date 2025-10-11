import {
	createSpotifyEmbedUrl,
	createYouTubeEmbedUrl,
	TClassicLinkNodeBundle,
	TLinkNode,
	TSpotifyEmbedLinkNodeBundle,
	TYouTubeEmbedLinkNodeBundle
} from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError, computeInnerBorderRadius } from '@/lib';
import { resolveAsset, resolveColor, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveFillStyleMixin,
	resolveImageStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin,
	resolveTextStyleMixin
} from '../../mixins';
import {
	TResolvedClassicLinkNodeBundle,
	TResolvedClassicLinkNodeContentMixin,
	TResolvedLinkNode,
	TResolvedSpotifyEmbedLinkNodeBundle,
	TResolvedSpotifyEmbedLinkNodeContentMixin,
	TResolvedYouTubeEmbedLinkNodeBundle,
	TResolvedYouTubeEmbedLinkNodeContentMixin
} from './types';

export function resolveLinkNode(
	node: TLinkNode,
	cx: TNodeResolveContext
): TResult<TResolvedLinkNode, AppError> {
	switch (node.bundle) {
		case 'classic':
			return resolveClassicLinkNodeBundle(node, cx);
		case 'youtube-embed':
			return resolveYouTubeEmbedLinkNodeBundle(node, cx);
		case 'spotify-embed':
			return resolveSpotifyEmbedLinkNodeBundle(node, cx);
		default:
			return Err(
				new AppError('#ERR_UNKNOWN_LINK_NODE_BUNDLE', {
					detail: `Unknown link node bundle`
				})
			);
	}
}

export function resolveClassicLinkNodeBundle(
	node: TClassicLinkNodeBundle,
	cx: TNodeResolveContext
): TResult<TResolvedClassicLinkNodeBundle, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, text, textSm, image, ...rest } =
		node;

	// Resolve content
	const favicon = content.userFavicon !== undefined ? content.userFavicon : content.favicon;
	const resolvedContent: TResolvedClassicLinkNodeContentMixin['value'] = {
		type: 'classic',
		url: content.url,
		title: content.userTitle ?? content.title,
		description: content.userDescription ?? content.description,
		favicon: favicon != null ? resolveAsset(favicon, cx.site) : undefined
	};

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
	const [isResolvedTextOk, resolvedTextErr, resolvedText] = resolveTextStyleMixin(text, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedTextOk) {
		return Err(resolvedTextErr.wrapWith('#ERR_RESOLVE_TEXT_STYLE'));
	}
	const [isResolvedTextSmOk, resolvedTextSmErr, resolvedTextSm] = resolveTextStyleMixin(textSm, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedTextSmOk) {
		return Err(resolvedTextSmErr.wrapWith('#ERR_RESOLVE_TEXT_SM_STYLE'));
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
			resolvedAutoLayout.verticalPadding,
			resolvedAutoLayout.horizontalPadding
		);

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		text: resolvedText,
		textSm: resolvedTextSm,
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

export function resolveYouTubeEmbedLinkNodeBundle(
	node: TYouTubeEmbedLinkNodeBundle,
	cx: TNodeResolveContext
): TResult<TResolvedYouTubeEmbedLinkNodeBundle, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, image, ...rest } = node;

	// Resolve content
	const resolvedContent: TResolvedYouTubeEmbedLinkNodeContentMixin['value'] = {
		type: 'youtube-embed',
		url: content.url,
		embedUrl: createYouTubeEmbedUrl(content.contentType, content.contentId)
	};

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
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(image, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedImageOk) {
		return Err(resolvedImageErr.wrapWith('#ERR_RESOLVE_IMAGE_STYLE'));
	}

	const imageBorderRadius =
		resolvedImage.appearance.borderRadius ??
		(resolvedAutoLayout.verticalPadding === 0 && resolvedAutoLayout.horizontalPadding === 0
			? 0 // If no padding let overflow hidden handle it
			: computeInnerBorderRadius(
					resolvedAppearance.borderRadius ?? 0,
					resolvedAutoLayout.verticalPadding,
					resolvedAutoLayout.horizontalPadding
				));

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
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

export function resolveSpotifyEmbedLinkNodeBundle(
	node: TSpotifyEmbedLinkNodeBundle,
	cx: TNodeResolveContext
): TResult<TResolvedSpotifyEmbedLinkNodeBundle, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, image, ...rest } = node;

	// Resolve content
	const resolvedContent: TResolvedSpotifyEmbedLinkNodeContentMixin['value'] = {
		type: 'spotify-embed',
		url: content.url,
		embedUrl: createSpotifyEmbedUrl(content.contentType, content.contentId),
		height: content.height,
		theme:
			content.theme != null
				? {
						backgroundBase:
							content.theme.backgroundBase != null
								? resolveColor(content.theme.backgroundBase)
								: undefined,
						backgroundTinted:
							content.theme.backgroundTinted != null
								? resolveColor(content.theme.backgroundTinted)
								: undefined,
						textBase:
							content.theme.textBase != null ? resolveColor(content.theme.textBase) : undefined,
						textSubdued:
							content.theme.textSubdued != null
								? resolveColor(content.theme.textSubdued)
								: undefined
					}
				: undefined
	};

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
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(image, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedImageOk) {
		return Err(resolvedImageErr.wrapWith('#ERR_RESOLVE_IMAGE_STYLE'));
	}

	const imageBorderRadius =
		resolvedImage.appearance.borderRadius ??
		(resolvedAutoLayout.verticalPadding === 0 && resolvedAutoLayout.horizontalPadding === 0
			? 0 // If no padding let overflow hidden handle it
			: computeInnerBorderRadius(
					resolvedAppearance.borderRadius ?? 0,
					resolvedAutoLayout.verticalPadding,
					resolvedAutoLayout.horizontalPadding
				));

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
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
