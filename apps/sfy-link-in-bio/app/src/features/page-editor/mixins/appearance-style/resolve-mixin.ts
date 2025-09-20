import { TAppearanceStyleMixin, TAppearanceStyleToken, TToken } from '@repo/editor';
import { Err, Ok, TResult, unwrapOrNull } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveTokenRef, TMixinResolveContext } from '../../lib';
import { TResolvedAppearanceStyleMixin } from './types';

export function resolveAppearanceStyleMixin<GBaseTokenValue extends TToken['value']>(
	appearance: TAppearanceStyleMixin['value'],
	cx: TMixinResolveContext<TAppearanceStyleToken['value'], GBaseTokenValue>
): TResult<TResolvedAppearanceStyleMixin['value'], AppError> {
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] = resolveTokenRef(
		appearance,
		{
			tokenMap: cx.tokenMap,
			expectedType: 'appearance',
			mapToTokenValue: cx.mapToTokenValue
		}
	);
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE'));
	}

	const [isResolvedVisibleOk, resolvedVisibleErr, resolvedVisible] = resolveTokenRef(
		resolvedAppearance.visible,
		{
			tokenMap: cx.tokenMap,
			expectedType: 'boolean',
			mapToTokenValue: (value: GBaseTokenValue) => {
				const tokenValue = cx.mapToTokenValue(value)?.visible;
				if (tokenValue == null) {
					return undefined;
				}
				const resolvedValue = resolveTokenRef(tokenValue, {
					tokenMap: cx.tokenMap,
					expectedType: 'boolean'
				});
				return unwrapOrNull(resolvedValue) ?? undefined;
			}
		}
	);
	if (!isResolvedVisibleOk) {
		return Err(resolvedVisibleErr.wrapWith('#ERR_RESOLVE_VISIBLE'));
	}
	const [isResolvedOpacityOk, resolvedOpacityErr, resolvedOpacity] = resolveTokenRef(
		resolvedAppearance.opacity,
		{
			tokenMap: cx.tokenMap,
			expectedType: 'number',
			mapToTokenValue: (value: GBaseTokenValue) => {
				const tokenValue = cx.mapToTokenValue(value)?.opacity;
				if (tokenValue == null) {
					return undefined;
				}
				const resolvedValue = resolveTokenRef(tokenValue, {
					tokenMap: cx.tokenMap,
					expectedType: 'number'
				});
				return unwrapOrNull(resolvedValue) ?? undefined;
			}
		}
	);
	if (!isResolvedOpacityOk) {
		return Err(resolvedOpacityErr.wrapWith('#ERR_RESOLVE_OPACITY'));
	}
	const [isResolvedBorderRadiusOk, resolvedBorderRadiusErr, resolvedBorderRadius] = resolveTokenRef(
		resolvedAppearance.borderRadius,
		{
			tokenMap: cx.tokenMap,
			expectedType: 'number',
			mapToTokenValue: (value: GBaseTokenValue) => {
				const tokenValue = cx.mapToTokenValue(value)?.borderRadius;
				if (tokenValue == null) {
					return undefined;
				}
				const resolvedValue = resolveTokenRef(tokenValue, {
					tokenMap: cx.tokenMap,
					expectedType: 'number'
				});
				return unwrapOrNull(resolvedValue) ?? undefined;
			}
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
