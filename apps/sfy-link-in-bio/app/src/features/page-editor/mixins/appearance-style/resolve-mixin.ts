import { TAppearanceStyleMixin, TAppearanceStyleToken, TMixinTokenSet } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveNestedTokenRef, TMixinResolveContext } from '../../lib';
import { TResolvedAppearanceStyleMixin } from './types';

export function resolveAppearanceStyleMixin<GTokenSet extends TMixinTokenSet>(
	appearance: TAppearanceStyleMixin['value'],
	cx: TMixinResolveContext<TAppearanceStyleToken['value'], GTokenSet>
): TResult<TResolvedAppearanceStyleMixin['value'], AppError> {
	const [isResolvedBorderRadiusOk, resolvedBorderRadiusErr, resolvedBorderRadius] =
		resolveNestedTokenRef(appearance, cx.tokenSet, cx.mapToToken, 'borderRadius');
	if (!isResolvedBorderRadiusOk) {
		return Err(resolvedBorderRadiusErr.wrapWith('#ERR_RESOLVE_BORDER_RADIUS'));
	}
	const [isResolvedVisibleOk, resolvedVisibleErr, resolvedVisible] = resolveNestedTokenRef(
		appearance,
		cx.tokenSet,
		cx.mapToToken,
		'visible'
	);
	if (!isResolvedVisibleOk) {
		return Err(resolvedVisibleErr.wrapWith('#ERR_RESOLVE_VISIBLE'));
	}
	const [isResolvedOpacityOk, resolvedOpacityErr, resolvedOpacity] = resolveNestedTokenRef(
		appearance,
		cx.tokenSet,
		cx.mapToToken,
		'opacity'
	);
	if (!isResolvedOpacityOk) {
		return Err(resolvedOpacityErr.wrapWith('#ERR_RESOLVE_OPACITY'));
	}

	return Ok({
		visible: resolvedVisible,
		opacity: resolvedOpacity,
		borderRadius: resolvedBorderRadius,
		styles: {
			visibility: resolvedVisible ? 'visible' : 'hidden',
			opacity: `${resolvedOpacity * 100}%`,
			borderRadius: resolvedBorderRadius ? `${resolvedBorderRadius}px` : undefined
		}
	});
}
