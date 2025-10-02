import { Err, Ok, TResult } from 'tuple-result';
import { TTheme } from '../environment';
import { TToken } from '../types';
import { EditorError } from './EditorError';
import { resolveTokenRef } from './resolve-token-ref';
import { tokenRef } from './token-ref';

export function reconstructThemeFromTokens(tokens: TToken[]): TResult<TTheme, EditorError> {
	const tokenMap: Record<TToken['key'], TToken> = {};
	for (const token of tokens) {
		tokenMap[token.key] = token;
	}

	// Get theme properties
	const [isKeyOk, keyErr, key] = resolveTokenRef(tokenRef('theme.key', 'string'), {
		tokenMap
	});
	if (!isKeyOk) {
		return Err(keyErr.wrapWith('#ERR_RECONSTRUCT_THEME_KEY'));
	}
	const [isNameOk, nameErr, name] = resolveTokenRef(tokenRef('theme.name', 'string'), {
		tokenMap
	});
	if (!isNameOk) {
		return Err(nameErr.wrapWith('#ERR_RECONSTRUCT_THEME_NAME'));
	}

	// Get paint properties
	const [isBase100PaintOk, base100PaintErr, base100Paint] = resolveTokenRef(
		tokenRef('paint.base100', 'paint'),
		{
			tokenMap
		}
	);
	if (!isBase100PaintOk) {
		return Err(base100PaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE100'));
	}
	const [isBase100ContentPaintOk, base100ContentPaintErr, base100ContentPaint] = resolveTokenRef(
		tokenRef('paint.base100.content', 'paint.solid'),
		{
			tokenMap
		}
	);
	if (!isBase100ContentPaintOk) {
		return Err(base100ContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE100_CONTENT'));
	}
	const [isBase200PaintOk, base200PaintErr, base200Paint] = resolveTokenRef(
		tokenRef('paint.base200', 'paint'),
		{
			tokenMap
		}
	);
	if (!isBase200PaintOk) {
		return Err(base200PaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE200'));
	}
	const [isBase200ContentPaintOk, base200ContentPaintErr, base200ContentPaint] = resolveTokenRef(
		tokenRef('paint.base200.content', 'paint.solid'),
		{
			tokenMap
		}
	);
	if (!isBase200ContentPaintOk) {
		return Err(base200ContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE200_CONTENT'));
	}
	const [isBase300PaintOk, base300PaintErr, base300Paint] = resolveTokenRef(
		tokenRef('paint.base300', 'paint'),
		{
			tokenMap
		}
	);
	if (!isBase300PaintOk) {
		return Err(base300PaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE300'));
	}
	const [isBase300ContentPaintOk, base300ContentPaintErr, base300ContentPaint] = resolveTokenRef(
		tokenRef('paint.base300.content', 'paint.solid'),
		{
			tokenMap
		}
	);
	if (!isBase300ContentPaintOk) {
		return Err(base300ContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE300_CONTENT'));
	}
	const [isPrimaryPaintOk, primaryPaintErr, primaryPaint] = resolveTokenRef(
		tokenRef('paint.primary', 'paint.solid'),
		{ tokenMap }
	);
	if (!isPrimaryPaintOk) {
		return Err(primaryPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_PRIMARY'));
	}
	const [isPrimaryContentPaintOk, primaryContentPaintErr, primaryContentPaint] = resolveTokenRef(
		tokenRef('paint.primary.content', 'paint.solid'),
		{ tokenMap }
	);
	if (!isPrimaryContentPaintOk) {
		return Err(primaryContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_PRIMARY_CONTENT'));
	}
	const [isSecondaryPaintOk, secondaryPaintErr, secondaryPaint] = resolveTokenRef(
		tokenRef('paint.secondary', 'paint.solid'),
		{ tokenMap }
	);
	if (!isSecondaryPaintOk) {
		return Err(secondaryPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SECONDARY'));
	}
	const [isSecondaryContentPaintOk, secondaryContentPaintErr, secondaryContentPaint] =
		resolveTokenRef(tokenRef('paint.secondary.content', 'paint.solid'), { tokenMap });
	if (!isSecondaryContentPaintOk) {
		return Err(secondaryContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SECONDARY_CONTENT'));
	}
	const [isNeutralPaintOk, neutralPaintErr, neutralPaint] = resolveTokenRef(
		tokenRef('paint.neutral', 'paint.solid'),
		{ tokenMap }
	);
	if (!isNeutralPaintOk) {
		return Err(neutralPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_NEUTRAL'));
	}
	const [isNeutralContentPaintOk, neutralContentPaintErr, neutralContentPaint] = resolveTokenRef(
		tokenRef('paint.neutral.content', 'paint.solid'),
		{ tokenMap }
	);
	if (!isNeutralContentPaintOk) {
		return Err(neutralContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_NEUTRAL_CONTENT'));
	}
	const [isAccentPaintOk, accentPaintErr, accentPaint] = resolveTokenRef(
		tokenRef('paint.accent', 'paint.solid'),
		{ tokenMap }
	);
	if (!isAccentPaintOk) {
		return Err(accentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ACCENT'));
	}
	const [isAccentContentPaintOk, accentContentPaintErr, accentContentPaint] = resolveTokenRef(
		tokenRef('paint.accent.content', 'paint.solid'),
		{ tokenMap }
	);
	if (!isAccentContentPaintOk) {
		return Err(accentContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ACCENT_CONTENT'));
	}
	const [isInfoPaintOk, infoPaintErr, infoPaint] = resolveTokenRef(
		tokenRef('paint.info', 'paint.solid'),
		{ tokenMap }
	);
	if (!isInfoPaintOk) {
		return Err(infoPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_INFO'));
	}
	const [isInfoContentPaintOk, infoContentPaintErr, infoContentPaint] = resolveTokenRef(
		tokenRef('paint.info.content', 'paint.solid'),
		{ tokenMap }
	);
	if (!isInfoContentPaintOk) {
		return Err(infoContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_INFO_CONTENT'));
	}
	const [isSuccessPaintOk, successPaintErr, successPaint] = resolveTokenRef(
		tokenRef('paint.success', 'paint.solid'),
		{ tokenMap }
	);
	if (!isSuccessPaintOk) {
		return Err(successPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SUCCESS'));
	}
	const [isSuccessContentPaintOk, successContentPaintErr, successContentPaint] = resolveTokenRef(
		tokenRef('paint.success.content', 'paint.solid'),
		{ tokenMap }
	);
	if (!isSuccessContentPaintOk) {
		return Err(successContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SUCCESS_CONTENT'));
	}
	const [isWarningPaintOk, warningPaintErr, warningPaint] = resolveTokenRef(
		tokenRef('paint.warning', 'paint.solid'),
		{ tokenMap }
	);
	if (!isWarningPaintOk) {
		return Err(warningPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_WARNING'));
	}
	const [isWarningContentPaintOk, warningContentPaintErr, warningContentPaint] = resolveTokenRef(
		tokenRef('paint.warning.content', 'paint.solid'),
		{ tokenMap }
	);
	if (!isWarningContentPaintOk) {
		return Err(warningContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_WARNING_CONTENT'));
	}
	const [isErrorPaintOk, errorPaintErr, errorPaint] = resolveTokenRef(
		tokenRef('paint.error', 'paint.solid'),
		{ tokenMap }
	);
	if (!isErrorPaintOk) {
		return Err(errorPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ERROR'));
	}
	const [isErrorContentPaintOk, errorContentPaintErr, errorContentPaint] = resolveTokenRef(
		tokenRef('paint.error.content', 'paint.solid'),
		{ tokenMap }
	);
	if (!isErrorContentPaintOk) {
		return Err(errorContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ERROR_CONTENT'));
	}

	// Get font properties
	const [isHeadingFontOk, headingFontErr, headingFont] = resolveTokenRef(
		tokenRef('font.heading', 'font'),
		{ tokenMap }
	);
	if (!isHeadingFontOk) {
		return Err(headingFontErr.wrapWith('#ERR_RECONSTRUCT_FONT_HEADING'));
	}
	const [isTextFontOk, textFontErr, textFont] = resolveTokenRef(tokenRef('font.text', 'font'), {
		tokenMap
	});
	if (!isTextFontOk) {
		return Err(textFontErr.wrapWith('#ERR_RECONSTRUCT_FONT_TEXT'));
	}

	// Get spacing properties
	const [isGapOk, gapErr, gap] = resolveTokenRef(tokenRef('spacing.gap', 'number'), { tokenMap });
	if (!isGapOk) {
		return Err(gapErr.wrapWith('#ERR_RECONSTRUCT_SPACING_GAP'));
	}

	// Get size properties
	const [isTextSizeOk, textSizeErr, textSize] = resolveTokenRef(tokenRef('size.text', 'number'), {
		tokenMap
	});
	if (!isTextSizeOk) {
		return Err(textSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_TEXT'));
	}
	const [isBoxSizeOk, boxSizeErr, boxSize] = resolveTokenRef(tokenRef('size.box', 'number'), {
		tokenMap
	});
	if (!isBoxSizeOk) {
		return Err(boxSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_BOX'));
	}
	const [isFieldSizeOk, fieldSizeErr, fieldSize] = resolveTokenRef(
		tokenRef('size.field', 'number'),
		{ tokenMap }
	);
	if (!isFieldSizeOk) {
		return Err(fieldSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_FIELD'));
	}
	const [isSelectorSizeOk, selectorSizeErr, selectorSize] = resolveTokenRef(
		tokenRef('size.selector', 'number'),
		{ tokenMap }
	);
	if (!isSelectorSizeOk) {
		return Err(selectorSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_SELECTOR'));
	}

	// Get radius properties
	const [isBoxRadiusOk, boxRadiusErr, boxRadius] = resolveTokenRef(
		tokenRef('radius.box', 'number'),
		{ tokenMap }
	);
	if (!isBoxRadiusOk) {
		return Err(boxRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_BOX'));
	}
	const [isFieldRadiusOk, fieldRadiusErr, fieldRadius] = resolveTokenRef(
		tokenRef('radius.field', 'number'),
		{ tokenMap }
	);
	if (!isFieldRadiusOk) {
		return Err(fieldRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_FIELD'));
	}
	const [isSelectorRadiusOk, selectorRadiusErr, selectorRadius] = resolveTokenRef(
		tokenRef('radius.selector', 'number'),
		{ tokenMap }
	);
	if (!isSelectorRadiusOk) {
		return Err(selectorRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_SELECTOR'));
	}

	// Get required effects properties
	const [isStrokeWidthOk, strokeWidthErr, strokeWidth] = resolveTokenRef(
		tokenRef('effects.stroke.width', 'number'),
		{ tokenMap }
	);
	if (!isStrokeWidthOk) {
		return Err(strokeWidthErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_STROKE_WIDTH'));
	}
	const [isShadowBlurOk, shadowBlurErr, shadowBlur] = resolveTokenRef(
		tokenRef('effects.shadow.blur', 'number'),
		{ tokenMap }
	);
	if (!isShadowBlurOk) {
		return Err(shadowBlurErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_BLUR'));
	}
	const [isShadowOffsetXOk, shadowOffsetXErr, shadowOffsetX] = resolveTokenRef(
		tokenRef('effects.shadow.offsetX', 'number'),
		{ tokenMap }
	);
	if (!isShadowOffsetXOk) {
		return Err(shadowOffsetXErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_OFFSET_X'));
	}
	const [isShadowOffsetYOk, shadowOffsetYErr, shadowOffsetY] = resolveTokenRef(
		tokenRef('effects.shadow.offsetY', 'number'),
		{ tokenMap }
	);
	if (!isShadowOffsetYOk) {
		return Err(shadowOffsetYErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_OFFSET_Y'));
	}
	const [isShadowSpreadOk, shadowSpreadErr, shadowSpread] = resolveTokenRef(
		tokenRef('effects.shadow.spread', 'number'),
		{ tokenMap }
	);
	if (!isShadowSpreadOk) {
		return Err(shadowSpreadErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_SPREAD'));
	}

	// Reconstruct theme
	return Ok({
		key,
		name,
		paint: {
			base100: base100Paint,
			base100Content: base100ContentPaint,
			base200: base200Paint,
			base200Content: base200ContentPaint,
			base300: base300Paint,
			base300Content: base300ContentPaint,
			primary: primaryPaint,
			primaryContent: primaryContentPaint,
			secondary: secondaryPaint,
			secondaryContent: secondaryContentPaint,
			neutral: neutralPaint,
			neutralContent: neutralContentPaint,
			accent: accentPaint,
			accentContent: accentContentPaint,
			info: infoPaint,
			infoContent: infoContentPaint,
			success: successPaint,
			successContent: successContentPaint,
			warning: warningPaint,
			warningContent: warningContentPaint,
			error: errorPaint,
			errorContent: errorContentPaint
		},
		typography: {
			heading: {
				fontFamily: headingFont.family,
				fontWeight: headingFont.weight as 400 | 500 | 600 | 700
			},
			text: {
				fontFamily: textFont.family,
				fontWeight: textFont.weight as 300 | 400 | 500
			}
		},
		gap,
		size: {
			text: textSize,
			box: boxSize,
			field: fieldSize,
			selector: selectorSize
		},
		radius: {
			box: boxRadius,
			field: fieldRadius,
			selector: selectorRadius
		},
		effects: {
			stroke: {
				width: strokeWidth
			},
			shadow: {
				blur: shadowBlur,
				offsetX: shadowOffsetX,
				offsetY: shadowOffsetY,
				spread: shadowSpread
			}
		}
	} satisfies TTheme);
}
