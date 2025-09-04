import {
	TLetterSpacing,
	TLineHeight,
	TMixinTokenSet,
	TTypographyStyleMixin,
	TTypographyStyleToken
} from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveTokenRef, TMixinResolveContext } from '../../lib';
import { TResolvedTypographyStyleMixin } from './types';

export function resolveTypographyStyleMixin<GTokenSet extends TMixinTokenSet>(
	typography: TTypographyStyleMixin['value'],
	cx: TMixinResolveContext<TTypographyStyleToken['value'], GTokenSet>
): TResult<TResolvedTypographyStyleMixin['value'], AppError> {
	const [isResolvedTypographyOk, resolvedTypographyErr, resolvedTypography] = resolveTokenRef(
		typography,
		{ mixin: { tokenSet: cx.mixinTokenSet, mapToTokenValue: cx.mapToMixinTokenValue } }
	);
	if (!isResolvedTypographyOk) {
		return Err(resolvedTypographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY'));
	}

	const [isResolvedFontOk, resolvedFontErr, resolvedFont] = resolveTokenRef(
		resolvedTypography.font,
		{
			mixin: {
				tokenSet: cx.mixinTokenSet,
				mapToTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.font
			},
			variable: {
				tokenMap: cx.variableTokenMap,
				expectedType: 'string'
			}
		}
	);
	if (!isResolvedFontOk) {
		return Err(resolvedFontErr.wrapWith('#ERR_RESOLVE_FONT'));
	}
	const [isResolvedFontSizeOk, resolvedFontSizeErr, resolvedFontSize] = resolveTokenRef(
		resolvedTypography.fontSize,
		{
			mixin: {
				tokenSet: cx.mixinTokenSet,
				mapToTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.fontSize
			},
			variable: {
				tokenMap: cx.variableTokenMap,
				expectedType: 'number'
			}
		}
	);
	if (!isResolvedFontSizeOk) {
		return Err(resolvedFontSizeErr.wrapWith('#ERR_RESOLVE_FONT_SIZE'));
	}
	const [
		isResolvedTextAlignHorizontalOk,
		resolvedTextAlignHorizontalErr,
		resolvedTextAlignHorizontal
	] = resolveTokenRef(resolvedTypography.textAlignHorizontal, {
		mixin: {
			tokenSet: cx.mixinTokenSet,
			mapToTokenValue: (ref, tokenSet) =>
				cx.mapToMixinTokenValue(ref, tokenSet)?.textAlignHorizontal
		},
		variable: {
			tokenMap: cx.variableTokenMap,
			expectedType: 'string'
		}
	});
	if (!isResolvedTextAlignHorizontalOk) {
		return Err(resolvedTextAlignHorizontalErr.wrapWith('#ERR_RESOLVE_TEXT_ALIGN_HORIZONTAL'));
	}
	const [isResolvedTextAlignVerticalOk, resolvedTextAlignVerticalErr, resolvedTextAlignVertical] =
		resolveTokenRef(resolvedTypography.textAlignVertical, {
			mixin: {
				tokenSet: cx.mixinTokenSet,
				mapToTokenValue: (ref, tokenSet) =>
					cx.mapToMixinTokenValue(ref, tokenSet)?.textAlignVertical
			},
			variable: {
				tokenMap: cx.variableTokenMap,
				expectedType: 'string'
			}
		});
	if (!isResolvedTextAlignVerticalOk) {
		return Err(resolvedTextAlignVerticalErr.wrapWith('#ERR_RESOLVE_TEXT_ALIGN_VERTICAL'));
	}
	const [isResolvedLineHeightOk, resolvedLineHeightErr, resolvedLineHeight] = resolveTokenRef(
		resolvedTypography.lineHeight,
		{
			mixin: {
				tokenSet: cx.mixinTokenSet,
				mapToTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.lineHeight
			},
			variable: {
				tokenMap: cx.variableTokenMap,
				expectedType: 'string'
			}
		}
	);
	if (!isResolvedLineHeightOk) {
		return Err(resolvedLineHeightErr.wrapWith('#ERR_RESOLVE_LINE_HEIGHT'));
	}
	const [isResolvedLetterSpacingOk, resolvedLetterSpacingErr, resolvedLetterSpacing] =
		resolveTokenRef(resolvedTypography.letterSpacing, {
			mixin: {
				tokenSet: cx.mixinTokenSet,
				mapToTokenValue: (ref, tokenSet) => cx.mapToMixinTokenValue(ref, tokenSet)?.letterSpacing
			},
			variable: {
				tokenMap: cx.variableTokenMap,
				expectedType: 'string'
			}
		});
	if (!isResolvedLetterSpacingOk) {
		return Err(resolvedLetterSpacingErr.wrapWith('#ERR_RESOLVE_LETTER_SPACING'));
	}

	return Ok({
		font: resolvedFont,
		fontSize: resolvedFontSize,
		textAlignHorizontal: resolvedTextAlignHorizontal,
		textAlignVertical: resolvedTextAlignVertical,
		lineHeight: resolvedLineHeight,
		letterSpacing: resolvedLetterSpacing,
		styles: {
			fontFamily: resolvedFont.family,
			fontSize: `${resolvedFontSize}px`,
			textAlign: resolvedTextAlignHorizontal,
			lineHeight: resolveLineHeight(resolvedLineHeight),
			letterSpacing: resolveLetterSpacing(resolvedLetterSpacing)
		}
	});
}

export function resolveLineHeight(lineHeight: TLineHeight): React.CSSProperties['lineHeight'] {
	switch (lineHeight.type) {
		case 'percent':
			return `${lineHeight.value}%`;
		case 'pixel':
			return `${lineHeight.value}px`;
		case 'auto':
			return 'normal';
	}
}

export function resolveLetterSpacing(
	letterSpacing: TLetterSpacing
): React.CSSProperties['letterSpacing'] {
	switch (letterSpacing.type) {
		case 'percent':
			return `${letterSpacing.value}%`;
		case 'pixel':
			return `${letterSpacing.value}px`;
		case 'auto':
			return 'normal';
	}
}
