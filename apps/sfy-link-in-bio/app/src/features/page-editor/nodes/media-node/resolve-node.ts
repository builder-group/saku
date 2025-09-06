import { TMediaNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError, computeInnerBorderRadius } from '@/lib';
import { resolveAsset, TNodeResolveContext } from '../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveFillStyleMixin,
	resolveImageStyleMixin,
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
	const { content, autoLayout, appearance, fill, stroke, shadow, image, ...rest } = node;

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
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(image, {
		node: cx,
		mixinTokenSet: cx.site.getMixinTokenSet('image'),
		mapToMixinTokenValue: (ref, tokenSet) => tokenSet?.[ref]?.value,
		variableTokenMap: cx.site.getVariableTokenMap()
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
			}
		}
	});
}
