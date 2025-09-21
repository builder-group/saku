import { TAppearanceStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveTokenRef, TMixinResolveContext } from '../../lib';
import { TResolvedAppearanceStyleMixin } from './types';

export function resolveAppearanceStyleMixin(
	appearance: TAppearanceStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedAppearanceStyleMixin['value'], AppError> {
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] = resolveTokenRef(
		appearance,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE'));
	}

	const [isResolvedVisibleOk, resolvedVisibleErr, resolvedVisible] = resolveTokenRef(
		resolvedAppearance.visible,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedVisibleOk) {
		return Err(resolvedVisibleErr.wrapWith('#ERR_RESOLVE_VISIBLE'));
	}
	const [isResolvedOpacityOk, resolvedOpacityErr, resolvedOpacity] = resolveTokenRef(
		resolvedAppearance.opacity,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedOpacityOk) {
		return Err(resolvedOpacityErr.wrapWith('#ERR_RESOLVE_OPACITY'));
	}
	const [isResolvedBorderRadiusOk, resolvedBorderRadiusErr, resolvedBorderRadius] = resolveTokenRef(
		resolvedAppearance.borderRadius,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedBorderRadiusOk) {
		return Err(resolvedBorderRadiusErr.wrapWith('#ERR_RESOLVE_BORDER_RADIUS'));
	}

	return Ok({
		visible: resolvedVisible,
		opacity: resolvedOpacity,
		borderRadius: resolvedBorderRadius ?? undefined,
		styles: {
			// Elements are visible by default, so we only need to explicitly hide them
			display: resolvedVisible ? undefined : 'none',
			opacity: `${resolvedOpacity * 100}%`,
			borderRadius: resolvedBorderRadius != null ? `${resolvedBorderRadius}px` : undefined
		}
	});
}
