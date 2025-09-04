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
import {
	TResolvedImageMediaNodeContent,
	TResolvedMediaNode,
	TResolvedMediaNodeContent
} from './types';

export function resolveMediaNode(
	node: TMediaNode,
	cx: TNodeResolveContext
): TResult<TResolvedMediaNode, AppError> {
	const { content, autoLayout, appearance, fill, stroke, shadow, ...rest } = node;

	// Resolve content
	let resolvedContent: TResolvedMediaNodeContent;
	switch (content.type) {
		case 'image': {
			let resolvedMedia: TResolvedImageMediaNodeContent['media'] | undefined;
			if (content.media != null) {
				const resolvedAsset = resolveAsset(content.media?.hash, cx.site);
				if (resolvedAsset != null) {
					resolvedMedia = {
						...content.media,
						src: resolvedAsset.src
					};
				}
			}
			resolvedContent = {
				...content,
				media: resolvedMedia
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

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow
	});
}
