import { TAppearanceStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveNestedTokenRef, TNodeResolveContext } from '../../lib';
import { TResolvedAppearanceStyleMixin } from './types';

export function resolveAppearanceStyleMixin(
	appearance: TAppearanceStyleMixin['value'],
	cx: TNodeResolveContext
): TResult<TResolvedAppearanceStyleMixin['value'], AppError> {
	const [isResolvedBorderRadiusOk, resolvedBorderRadiusErr, resolvedBorderRadius] =
		resolveNestedTokenRef('borderRadius', appearance, cx.site.getTokenSet('appearance'));
	if (!isResolvedBorderRadiusOk) {
		return Err(resolvedBorderRadiusErr.wrapWith('#ERR_RESOLVE_BORDER_RADIUS'));
	}

	const [isResolvedVisibleOk, resolvedVisibleErr, resolvedVisible] = resolveNestedTokenRef(
		'visible',
		appearance,
		cx.site.getTokenSet('appearance')
	);
	if (!isResolvedVisibleOk) {
		return Err(resolvedVisibleErr.wrapWith('#ERR_RESOLVE_VISIBLE'));
	}

	const [isResolvedOpacityOk, resolvedOpacityErr, resolvedOpacity] = resolveNestedTokenRef(
		'opacity',
		appearance,
		cx.site.getTokenSet('appearance')
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
