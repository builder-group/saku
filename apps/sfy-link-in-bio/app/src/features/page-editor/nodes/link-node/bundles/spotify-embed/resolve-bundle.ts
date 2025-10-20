import { TSpotifyEmbedLinkNodeBundle } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError, computeInnerBorderRadius } from '@/lib';
import { TNodeResolveContext } from '../../../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveEmbedStyleMixin,
	resolveFillStyleMixin,
	resolveShadowStyleMixin,
	resolveSpotifyEmbedLinkNodeContentMixin,
	resolveStrokeStyleMixin
} from '../../../../mixins';
import { TResolvedSpotifyEmbedLinkNodeBundle } from '../../types';

export function resolveSpotifyEmbedBundle(
	node: TSpotifyEmbedLinkNodeBundle,
	cx: TNodeResolveContext
): TResult<TResolvedSpotifyEmbedLinkNodeBundle, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, embed, ...rest } = node;

	// Resolve content
	const [isResolvedContentOk, resolvedContentErr, resolvedContent] =
		resolveSpotifyEmbedLinkNodeContentMixin(content, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedContentOk) {
		return Err(resolvedContentErr.wrapWith('#ERR_RESOLVE_SPOTIFY_EMBED_LINK_NODE_CONTENT'));
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
	const [isResolvedEmbedOk, resolvedEmbedErr, resolvedEmbed] = resolveEmbedStyleMixin(embed, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedEmbedOk) {
		return Err(resolvedEmbedErr.wrapWith('#ERR_RESOLVE_EMBED_STYLE'));
	}

	const embedBorderRadius =
		resolvedEmbed.appearance.borderRadius ??
		(resolvedAutoLayout.paddingTop === 0 &&
		resolvedAutoLayout.paddingRight === 0 &&
		resolvedAutoLayout.paddingBottom === 0 &&
		resolvedAutoLayout.paddingLeft === 0
			? 0 // If no padding let overflow hidden handle it
			: computeInnerBorderRadius(
					resolvedAppearance.borderRadius ?? 0,
					Math.max(
						resolvedAutoLayout.paddingTop ?? 0,
						resolvedAutoLayout.paddingRight ?? 0,
						resolvedAutoLayout.paddingBottom ?? 0,
						resolvedAutoLayout.paddingLeft ?? 0
					)
				));

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		embed: {
			...resolvedEmbed,
			appearance: {
				...resolvedEmbed.appearance,
				borderRadius: embedBorderRadius,
				styles: {
					...resolvedEmbed.appearance.styles,
					borderRadius: `${embedBorderRadius}px`
				}
			},
			styles: {
				...resolvedEmbed.styles,
				borderRadius: `${embedBorderRadius}px`
			}
		}
	});
}
