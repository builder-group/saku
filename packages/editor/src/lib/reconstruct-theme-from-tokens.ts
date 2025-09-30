import { Err, Ok, TResult } from 'tuple-result';
import { TTheme } from '../environment';
import { TToken } from '../types';
import { EditorError } from './EditorError';

export function reconstructThemeFromTokens(tokens: TToken[]): TResult<TTheme, EditorError> {
	const getValue = <GType extends TToken['type']>(
		tokenType: GType,
		key: string,
		defaultValue?: Extract<TToken, { type: GType }>['value']
	): TResult<Extract<TToken, { type: GType }>['value'], EditorError> => {
		const token = tokens.find((t) => t.key === key);
		if (token == null) {
			if (defaultValue != null) {
				return Ok(defaultValue as any);
			}
			return Err(
				new EditorError('#ERR_MISSING_REQUIRED_TOKEN', {
					detail: `Missing required token: ${key}`
				})
			);
		}
		if (token.type !== tokenType) {
			return Err(
				new EditorError('#ERR_TOKEN_TYPE_MISMATCH', {
					detail: `Token ${key} has type '${token.type}' but expected '${tokenType}'`
				})
			);
		}
		return Ok(token.value as any);
	};

	// Get theme properties
	const [isKeyOk, keyErr, key] = getValue('string', 'theme.key');
	if (!isKeyOk) {
		return Err(keyErr.wrapWith('#ERR_RECONSTRUCT_THEME_KEY'));
	}
	const [isNameOk, nameErr, name] = getValue('string', 'theme.name');
	if (!isNameOk) {
		return Err(nameErr.wrapWith('#ERR_RECONSTRUCT_THEME_NAME'));
	}

	// Get paint properties
	const [isBase100PaintOk, base100PaintErr, base100Paint] = getValue(
		'solid-paint',
		'paint.base100'
	);
	if (!isBase100PaintOk) {
		return Err(base100PaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE100'));
	}
	const [isBase100ContentPaintOk, base100ContentPaintErr, base100ContentPaint] = getValue(
		'solid-paint',
		'paint.base100.content'
	);
	if (!isBase100ContentPaintOk) {
		return Err(base100ContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE100_CONTENT'));
	}
	const [isBase200PaintOk, base200PaintErr, base200Paint] = getValue(
		'solid-paint',
		'paint.base200'
	);
	if (!isBase200PaintOk) {
		return Err(base200PaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE200'));
	}
	const [isBase200ContentPaintOk, base200ContentPaintErr, base200ContentPaint] = getValue(
		'solid-paint',
		'paint.base200.content'
	);
	if (!isBase200ContentPaintOk) {
		return Err(base200ContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE200_CONTENT'));
	}
	const [isBase300PaintOk, base300PaintErr, base300Paint] = getValue(
		'solid-paint',
		'paint.base300'
	);
	if (!isBase300PaintOk) {
		return Err(base300PaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE300'));
	}
	const [isBase300ContentPaintOk, base300ContentPaintErr, base300ContentPaint] = getValue(
		'solid-paint',
		'paint.base300.content'
	);
	if (!isBase300ContentPaintOk) {
		return Err(base300ContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE300_CONTENT'));
	}
	const [isPrimaryPaintOk, primaryPaintErr, primaryPaint] = getValue(
		'solid-paint',
		'paint.primary'
	);
	if (!isPrimaryPaintOk) {
		return Err(primaryPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_PRIMARY'));
	}
	const [isPrimaryContentPaintOk, primaryContentPaintErr, primaryContentPaint] = getValue(
		'solid-paint',
		'paint.primary.content'
	);
	if (!isPrimaryContentPaintOk) {
		return Err(primaryContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_PRIMARY_CONTENT'));
	}
	const [isSecondaryPaintOk, secondaryPaintErr, secondaryPaint] = getValue(
		'solid-paint',
		'paint.secondary'
	);
	if (!isSecondaryPaintOk) {
		return Err(secondaryPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SECONDARY'));
	}
	const [isSecondaryContentPaintOk, secondaryContentPaintErr, secondaryContentPaint] = getValue(
		'solid-paint',
		'paint.secondary.content'
	);
	if (!isSecondaryContentPaintOk) {
		return Err(secondaryContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SECONDARY_CONTENT'));
	}
	const [isNeutralPaintOk, neutralPaintErr, neutralPaint] = getValue(
		'solid-paint',
		'paint.neutral'
	);
	if (!isNeutralPaintOk) {
		return Err(neutralPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_NEUTRAL'));
	}
	const [isNeutralContentPaintOk, neutralContentPaintErr, neutralContentPaint] = getValue(
		'solid-paint',
		'paint.neutral.content'
	);
	if (!isNeutralContentPaintOk) {
		return Err(neutralContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_NEUTRAL_CONTENT'));
	}
	const [isAccentPaintOk, accentPaintErr, accentPaint] = getValue('solid-paint', 'paint.accent');
	if (!isAccentPaintOk) {
		return Err(accentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ACCENT'));
	}
	const [isAccentContentPaintOk, accentContentPaintErr, accentContentPaint] = getValue(
		'solid-paint',
		'paint.accent.content'
	);
	if (!isAccentContentPaintOk) {
		return Err(accentContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ACCENT_CONTENT'));
	}
	const [isInfoPaintOk, infoPaintErr, infoPaint] = getValue('solid-paint', 'paint.info');
	if (!isInfoPaintOk) {
		return Err(infoPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_INFO'));
	}
	const [isInfoContentPaintOk, infoContentPaintErr, infoContentPaint] = getValue(
		'solid-paint',
		'paint.info.content'
	);
	if (!isInfoContentPaintOk) {
		return Err(infoContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_INFO_CONTENT'));
	}
	const [isSuccessPaintOk, successPaintErr, successPaint] = getValue(
		'solid-paint',
		'paint.success'
	);
	if (!isSuccessPaintOk) {
		return Err(successPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SUCCESS'));
	}
	const [isSuccessContentPaintOk, successContentPaintErr, successContentPaint] = getValue(
		'solid-paint',
		'paint.success.content'
	);
	if (!isSuccessContentPaintOk) {
		return Err(successContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SUCCESS_CONTENT'));
	}
	const [isWarningPaintOk, warningPaintErr, warningPaint] = getValue(
		'solid-paint',
		'paint.warning'
	);
	if (!isWarningPaintOk) {
		return Err(warningPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_WARNING'));
	}
	const [isWarningContentPaintOk, warningContentPaintErr, warningContentPaint] = getValue(
		'solid-paint',
		'paint.warning.content'
	);
	if (!isWarningContentPaintOk) {
		return Err(warningContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_WARNING_CONTENT'));
	}
	const [isErrorPaintOk, errorPaintErr, errorPaint] = getValue('solid-paint', 'paint.error');
	if (!isErrorPaintOk) {
		return Err(errorPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ERROR'));
	}
	const [isErrorContentPaintOk, errorContentPaintErr, errorContentPaint] = getValue(
		'solid-paint',
		'paint.error.content'
	);
	if (!isErrorContentPaintOk) {
		return Err(errorContentPaintErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ERROR_CONTENT'));
	}

	// Get font properties
	const [isHeadingFontOk, headingFontErr, headingFont] = getValue('font', 'font.heading');
	if (!isHeadingFontOk) {
		return Err(headingFontErr.wrapWith('#ERR_RECONSTRUCT_FONT_HEADING'));
	}
	const [isTextFontOk, textFontErr, textFont] = getValue('font', 'font.text');
	if (!isTextFontOk) {
		return Err(textFontErr.wrapWith('#ERR_RECONSTRUCT_FONT_TEXT'));
	}

	// Get spacing properties
	const [isGapOk, gapErr, gap] = getValue('number', 'spacing.gap');
	if (!isGapOk) {
		return Err(gapErr.wrapWith('#ERR_RECONSTRUCT_SPACING_GAP'));
	}

	// Get size properties
	const [isTextSizeOk, textSizeErr, textSize] = getValue('number', 'size.text');
	if (!isTextSizeOk) {
		return Err(textSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_TEXT'));
	}
	const [isBoxSizeOk, boxSizeErr, boxSize] = getValue('number', 'size.box');
	if (!isBoxSizeOk) {
		return Err(boxSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_BOX'));
	}
	const [isFieldSizeOk, fieldSizeErr, fieldSize] = getValue('number', 'size.field', 1);
	if (!isFieldSizeOk) {
		return Err(fieldSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_FIELD'));
	}
	const [isSelectorSizeOk, selectorSizeErr, selectorSize] = getValue('number', 'size.selector', 1);
	if (!isSelectorSizeOk) {
		return Err(selectorSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_SELECTOR'));
	}

	// Get radius properties
	const [isBoxRadiusOk, boxRadiusErr, boxRadius] = getValue('number', 'radius.box');
	if (!isBoxRadiusOk) {
		return Err(boxRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_BOX'));
	}
	const [isFieldRadiusOk, fieldRadiusErr, fieldRadius] = getValue('number', 'radius.field');
	if (!isFieldRadiusOk) {
		return Err(fieldRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_FIELD'));
	}
	const [isSelectorRadiusOk, selectorRadiusErr, selectorRadius] = getValue(
		'number',
		'radius.selector'
	);
	if (!isSelectorRadiusOk) {
		return Err(selectorRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_SELECTOR'));
	}

	// Get required effects properties
	const [isStrokeWidthOk, strokeWidthErr, strokeWidth] = getValue('number', 'effects.stroke.width');
	if (!isStrokeWidthOk) {
		return Err(strokeWidthErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_STROKE_WIDTH'));
	}
	const [isShadowBlurOk, shadowBlurErr, shadowBlur] = getValue('number', 'effects.shadow.blur');
	if (!isShadowBlurOk) {
		return Err(shadowBlurErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_BLUR'));
	}
	const [isShadowOffsetXOk, shadowOffsetXErr, shadowOffsetX] = getValue(
		'number',
		'effects.shadow.offsetX'
	);
	if (!isShadowOffsetXOk) {
		return Err(shadowOffsetXErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_OFFSET_X'));
	}
	const [isShadowOffsetYOk, shadowOffsetYErr, shadowOffsetY] = getValue(
		'number',
		'effects.shadow.offsetY'
	);
	if (!isShadowOffsetYOk) {
		return Err(shadowOffsetYErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_OFFSET_Y'));
	}
	const [isShadowSpreadOk, shadowSpreadErr, shadowSpread] = getValue(
		'number',
		'effects.shadow.spread'
	);
	if (!isShadowSpreadOk) {
		return Err(shadowSpreadErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_SPREAD'));
	}

	// Reconstruct theme
	return Ok({
		key,
		name,
		color: {
			base100: base100Paint.color,
			base100Content: base100ContentPaint.color,
			base200: base200Paint.color,
			base200Content: base200ContentPaint.color,
			base300: base300Paint.color,
			base300Content: base300ContentPaint.color,
			primary: primaryPaint.color,
			primaryContent: primaryContentPaint.color,
			secondary: secondaryPaint.color,
			secondaryContent: secondaryContentPaint.color,
			neutral: neutralPaint.color,
			neutralContent: neutralContentPaint.color,
			accent: accentPaint.color,
			accentContent: accentContentPaint.color,
			info: infoPaint.color,
			infoContent: infoContentPaint.color,
			success: successPaint.color,
			successContent: successContentPaint.color,
			warning: warningPaint.color,
			warningContent: warningContentPaint.color,
			error: errorPaint.color,
			errorContent: errorContentPaint.color
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
