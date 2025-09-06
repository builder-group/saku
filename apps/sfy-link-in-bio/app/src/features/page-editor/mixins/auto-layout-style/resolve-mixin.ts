import { TAutoLayoutStyleMixin, TAutoLayoutStyleToken, TMixinTokenSet } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveTokenRef, TMixinResolveContext } from '../../lib';
import { TResolvedAutoLayoutStyleMixin } from './types';

export function resolveAutoLayoutStyleMixin<GTokenSet extends TMixinTokenSet>(
	layout: TAutoLayoutStyleMixin['value'],
	cx: TMixinResolveContext<TAutoLayoutStyleToken['value'], GTokenSet>
): TResult<TResolvedAutoLayoutStyleMixin['value'], AppError> {
	const [isResolvedAutoLayoutOk, resolvedAutoLayoutErr, resolvedAutoLayout] = resolveTokenRef(
		layout,
		{ mixin: { tokenSet: cx.mixinTokenSet, mapToTokenValue: cx.mapToMixinTokenValue } }
	);
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT'));
	}

	const [isResolvedHorizontalPaddingOk, resolvedHorizontalPaddingErr, resolvedHorizontalPadding] =
		resolveTokenRef(resolvedAutoLayout.horizontalPadding, {
			mixin: {
				tokenSet: cx.mixinTokenSet,
				mapToTokenValue: (ref, tokenSet) =>
					cx.mapToMixinTokenValue(ref, tokenSet)?.horizontalPadding
			},
			variable: {
				tokenMap: cx.variableTokenMap,
				expectedType: 'number'
			}
		});
	if (!isResolvedHorizontalPaddingOk) {
		return Err(resolvedHorizontalPaddingErr.wrapWith('#ERR_RESOLVE_HORIZONTAL_PADDING'));
	}
	const [isResolvedVerticalPaddingOk, resolvedVerticalPaddingErr, resolvedVerticalPadding] =
		resolveTokenRef(resolvedAutoLayout.verticalPadding, {
			mixin: {
				tokenSet: cx.mixinTokenSet,
				mapToTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.verticalPadding
			},
			variable: {
				tokenMap: cx.variableTokenMap,
				expectedType: 'number'
			}
		});
	if (!isResolvedVerticalPaddingOk) {
		return Err(resolvedVerticalPaddingErr.wrapWith('#ERR_RESOLVE_VERTICAL_PADDING'));
	}
	const [isResolvedHorizontalGapOk, resolvedHorizontalGapErr, resolvedHorizontalGap] =
		resolveTokenRef(resolvedAutoLayout.horizontalGap, {
			mixin: {
				tokenSet: cx.mixinTokenSet,
				mapToTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.horizontalGap
			},
			variable: {
				tokenMap: cx.variableTokenMap,
				expectedType: 'number'
			}
		});
	if (!isResolvedHorizontalGapOk) {
		return Err(resolvedHorizontalGapErr.wrapWith('#ERR_RESOLVE_HORIZONTAL_GAP'));
	}
	const [isResolvedVerticalGapOk, resolvedVerticalGapErr, resolvedVerticalGap] = resolveTokenRef(
		resolvedAutoLayout.verticalGap,
		{
			mixin: {
				tokenSet: cx.mixinTokenSet,
				mapToTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.verticalGap
			},
			variable: {
				tokenMap: cx.variableTokenMap,
				expectedType: 'number'
			}
		}
	);
	if (!isResolvedVerticalGapOk) {
		return Err(resolvedVerticalGapErr.wrapWith('#ERR_RESOLVE_VERTICAL_GAP'));
	}

	return Ok({
		horizontalPadding: resolvedHorizontalPadding,
		verticalPadding: resolvedVerticalPadding,
		horizontalGap: resolvedHorizontalGap,
		verticalGap: resolvedVerticalGap,
		styles: {
			padding:
				resolvedVerticalPadding != null || resolvedHorizontalPadding != null
					? `${resolvedVerticalPadding ?? 0}px ${resolvedHorizontalPadding ?? 0}px`
					: undefined,
			gap:
				resolvedVerticalGap != null || resolvedHorizontalGap != null
					? `${resolvedVerticalGap ?? 0}px ${resolvedHorizontalGap ?? 0}px`
					: undefined
		}
	});
}
