import { resolveTokenRef, TAnimationStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { TResolvedAnimationStyleMixin } from './types';

export function resolveAnimationStyleMixin(
	animation: TAnimationStyleMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedAnimationStyleMixin['value'], AppError> {
	const [isResolvedAnimationOk, resolvedAnimationErr, resolvedAnimation] = resolveTokenRef(
		animation,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedAnimationOk) {
		return Err(AppError.fromEditorError(resolvedAnimationErr).wrapWith('#ERR_RESOLVE_ANIMATION'));
	}
	if (resolvedAnimation == null) {
		return Ok(null);
	}

	const animationValue = resolvedAnimation.animation;
	const [isResolvedDurationOk, resolvedDurationErr, resolvedDuration] = resolveTokenRef(
		animationValue.duration,
		{
			tokenMap: cx.tokenMap
		}
	);
	if (!isResolvedDurationOk) {
		return Err(AppError.fromEditorError(resolvedDurationErr).wrapWith('#ERR_RESOLVE_DURATION'));
	}

	return Ok({
		animation: {
			type: animationValue.type,
			duration: resolvedDuration
		},
		styles: {
			animationName: animationValue.type,
			animationDuration: `${resolvedDuration}ms`,
			animationIterationCount: 'infinite',
			animationTimingFunction: 'ease-in-out',
			animationFillMode: 'none'
		}
	});
}
