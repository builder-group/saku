import { resolveTokenRef, TEmbedStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { resolveAppearanceStyleMixin } from '../appearance-style';
import { resolveShadowStyleMixin } from '../shadow-style';
import { resolveStrokeStyleMixin } from '../stroke-style';
import { TResolvedEmbedStyleMixin } from './types';

export function resolveEmbedStyleMixin(
	embed: TEmbedStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedEmbedStyleMixin['value'], AppError> {
	const [isResolvedEmbedOk, resolvedEmbedErr, resolvedEmbed] = resolveTokenRef(embed, {
		tokenMap: cx.tokenMap
	});
	if (!isResolvedEmbedOk) {
		return Err(AppError.fromEditorError(resolvedEmbedErr).wrapWith('#ERR_RESOLVE_EMBED_STYLE'));
	}

	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(resolvedEmbed.appearance, cx);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		resolvedEmbed.stroke,
		cx
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		resolvedEmbed.shadow,
		cx
	);
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}

	return Ok({
		appearance: resolvedAppearance,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		styles: {
			...resolvedAppearance.styles,
			...resolvedStroke?.styles,
			...resolvedShadow?.styles
		}
	});
}
