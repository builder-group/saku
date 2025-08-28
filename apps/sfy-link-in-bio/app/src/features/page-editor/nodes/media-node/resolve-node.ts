import { TMediaNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveFillStyleMixin,
	resolveShadowStyleMixin,
	resolveStrokeStyleMixin
} from '../../mixins';
import { TResolvedMedia, TResolvedMediaNode } from './types';

export function resolveMediaNode(
	node: TMediaNode,
	cx: TNodeResolveContext
): TResult<TResolvedMediaNode, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, ...rest } = node;

	let resolvedMedia: TResolvedMedia | undefined;
	switch (content.media?.type) {
		case 'image': {
			const resolvedAsset = resolveAsset(content.media.hash, cx.site);
			if (resolvedAsset != null) {
				resolvedMedia = {
					...content.media,
					src: resolvedAsset.src
				};
			}
			break;
		}
		default:
		// do nothing
	}

	const [isResolvedAutoLayoutOk, resolvedAutoLayoutErr, resolvedAutoLayout] =
		resolveAutoLayoutStyleMixin(autoLayout, {
			node: cx,
			tokenSet: cx.site.getTokenSet('autoLayout'),
			mapToToken: (ref, tokenSet) => tokenSet?.[ref]
		});
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, {
			node: cx,
			tokenSet: cx.site.getTokenSet('appearance'),
			mapToToken: (ref, tokenSet) => tokenSet?.[ref]
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(fill, {
		node: cx,
		tokenSet: cx.site.getTokenSet('fill'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(stroke, {
		node: cx,
		tokenSet: cx.site.getTokenSet('stroke'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]
	});
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(shadow, {
		node: cx,
		tokenSet: cx.site.getTokenSet('shadow'),
		mapToToken: (ref, tokenSet) => tokenSet?.[ref]
	});
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		...rest,
		content: {
			media: resolvedMedia
		},
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow
	});
}
