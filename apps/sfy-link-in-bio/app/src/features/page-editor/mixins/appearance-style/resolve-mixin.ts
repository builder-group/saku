import { TAppearanceStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveNestedTokenRef, TNodeResolveContext } from '../../lib';
import { TResolvedAppearanceStyleMixin } from './types';

export function resolveAppearanceStyleMixin(
	appearance: TAppearanceStyleMixin['value'],
	cx: TNodeResolveContext
): TResult<TResolvedAppearanceStyleMixin['value'], AppError> {
	const appearanceTokenSet = cx.site.getTokenSet('appearance');

	const [isResolvedBorderRadiusOk, resolvedBorderRadiusErr, resolvedBorderRadius] =
		resolveNestedTokenRef(appearance, appearanceTokenSet, 'borderRadius');
	if (!isResolvedBorderRadiusOk) {
		return Err(resolvedBorderRadiusErr.wrapWith('#ERR_RESOLVE_BORDER_RADIUS'));
	}
	const [isResolvedVisibleOk, resolvedVisibleErr, resolvedVisible] = resolveNestedTokenRef(
		appearance,
		appearanceTokenSet,
		'visible'
	);
	if (!isResolvedVisibleOk) {
		return Err(resolvedVisibleErr.wrapWith('#ERR_RESOLVE_VISIBLE'));
	}
	const [isResolvedOpacityOk, resolvedOpacityErr, resolvedOpacity] = resolveNestedTokenRef(
		appearance,
		appearanceTokenSet,
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

export interface TResolveAppearanceStyleMixinParentMixin {
	visible: boolean;
	opacity: number;
	borderRadius?: number;
}
