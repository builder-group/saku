import { TImageStyleMixin, TImageStyleToken, TMixinTokenSet } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { resolveAppearanceStyleMixin } from '../appearance-style';
import { resolveShadowStyleMixin } from '../shadow-style';
import { resolveStrokeStyleMixin } from '../stroke-style';
import { TResolvedImageStyleMixin } from './types';

export function resolveImageStyleMixin<GTokenSet extends TMixinTokenSet>(
	image: TImageStyleMixin['value'],
	cx: TMixinResolveContext<TImageStyleToken['value'], GTokenSet>
): TResult<TResolvedImageStyleMixin['value'], AppError> {
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(image.appearance, {
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.appearance
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(
		image.stroke,
		{
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.stroke
		}
	);
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(
		image.shadow,
		{
			...cx,
			mapToMixinTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.shadow
		}
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
