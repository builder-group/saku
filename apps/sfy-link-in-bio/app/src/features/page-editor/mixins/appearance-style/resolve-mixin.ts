import { resolveTokenRef, TAppearanceStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import * as v from 'valibot';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
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
		return Err(AppError.fromEditorError(resolvedAppearanceErr).wrapWith('#ERR_RESOLVE_APPEARANCE'));
	}

	const [isResolvedVisibleOk, resolvedVisibleErr, resolvedVisible] = resolveTokenRef(
		resolvedAppearance.visible,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.boolean()
		}
	);
	if (!isResolvedVisibleOk) {
		return Err(AppError.fromEditorError(resolvedVisibleErr).wrapWith('#ERR_RESOLVE_VISIBLE'));
	}
	const [isResolvedOpacityOk, resolvedOpacityErr, resolvedOpacity] = resolveTokenRef(
		resolvedAppearance.opacity,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.number()
		}
	);
	if (!isResolvedOpacityOk) {
		return Err(AppError.fromEditorError(resolvedOpacityErr).wrapWith('#ERR_RESOLVE_OPACITY'));
	}
	const [isResolvedBorderRadiusOk, resolvedBorderRadiusErr, resolvedBorderRadius] = resolveTokenRef(
		resolvedAppearance.borderRadius,
		{
			tokenMap: cx.tokenMap,
			expectedSchema: v.nullable(v.number())
		}
	);
	if (!isResolvedBorderRadiusOk) {
		return Err(
			AppError.fromEditorError(resolvedBorderRadiusErr).wrapWith('#ERR_RESOLVE_BORDER_RADIUS')
		);
	}

	return Ok({
		visible: resolvedVisible,
		opacity: resolvedOpacity,
		borderRadius: resolvedBorderRadius ?? undefined,
		styles: {
			display: resolvedVisible ? undefined : 'none', // Elements are visible by default, so we only need to explicitly hide them
			opacity: `${resolvedOpacity * 100}%`,
			borderRadius: resolvedBorderRadius != null ? `${resolvedBorderRadius}px` : undefined
		}
	});
}
