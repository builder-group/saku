import { Err, Ok, TResult } from 'tuple-result';
import { TTheme } from '../environment';
import { TToken } from '../types';
import { EditorError } from './EditorError';

export function reconstructThemeFromTokens(tokens: TToken[]): TResult<TTheme, EditorError> {
	// Helper to get token value with type safety
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

	// Get color properties
	const [isBase100Ok, base100Err, base100] = getValue('color', 'color.base100');
	if (!isBase100Ok) {
		return Err(base100Err.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE100'));
	}
	const [isBase200Ok, base200Err, base200] = getValue('color', 'color.base200');
	if (!isBase200Ok) {
		return Err(base200Err.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE200'));
	}
	const [isBase300Ok, base300Err, base300] = getValue('color', 'color.base300');
	if (!isBase300Ok) {
		return Err(base300Err.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE300'));
	}
	const [isBaseContentOk, baseContentErr, baseContent] = getValue('color', 'color.baseContent');
	if (!isBaseContentOk) {
		return Err(baseContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE_CONTENT'));
	}
	const [isPrimaryOk, primaryErr, primary] = getValue('color', 'color.primary');
	if (!isPrimaryOk) {
		return Err(primaryErr.wrapWith('#ERR_RECONSTRUCT_COLOR_PRIMARY'));
	}
	const [isPrimaryContentOk, primaryContentErr, primaryContent] = getValue(
		'color',
		'color.primaryContent'
	);
	if (!isPrimaryContentOk) {
		return Err(primaryContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_PRIMARY_CONTENT'));
	}
	const [isSecondaryOk, secondaryErr, secondary] = getValue('color', 'color.secondary');
	if (!isSecondaryOk) {
		return Err(secondaryErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SECONDARY'));
	}
	const [isSecondaryContentOk, secondaryContentErr, secondaryContent] = getValue(
		'color',
		'color.secondaryContent'
	);
	if (!isSecondaryContentOk) {
		return Err(secondaryContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SECONDARY_CONTENT'));
	}
	const [isNeutralOk, neutralErr, neutral] = getValue('color', 'color.neutral');
	if (!isNeutralOk) {
		return Err(neutralErr.wrapWith('#ERR_RECONSTRUCT_COLOR_NEUTRAL'));
	}
	const [isNeutralContentOk, neutralContentErr, neutralContent] = getValue(
		'color',
		'color.neutralContent'
	);
	if (!isNeutralContentOk) {
		return Err(neutralContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_NEUTRAL_CONTENT'));
	}
	const [isAccentOk, accentErr, accent] = getValue('color', 'color.accent');
	if (!isAccentOk) {
		return Err(accentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ACCENT'));
	}
	const [isAccentContentOk, accentContentErr, accentContent] = getValue(
		'color',
		'color.accentContent'
	);
	if (!isAccentContentOk) {
		return Err(accentContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ACCENT_CONTENT'));
	}
	const [isInfoOk, infoErr, info] = getValue('color', 'color.info');
	if (!isInfoOk) {
		return Err(infoErr.wrapWith('#ERR_RECONSTRUCT_COLOR_INFO'));
	}
	const [isInfoContentOk, infoContentErr, infoContent] = getValue('color', 'color.infoContent');
	if (!isInfoContentOk) {
		return Err(infoContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_INFO_CONTENT'));
	}
	const [isSuccessOk, successErr, success] = getValue('color', 'color.success');
	if (!isSuccessOk) {
		return Err(successErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SUCCESS'));
	}
	const [isSuccessContentOk, successContentErr, successContent] = getValue(
		'color',
		'color.successContent'
	);
	if (!isSuccessContentOk) {
		return Err(successContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SUCCESS_CONTENT'));
	}
	const [isWarningOk, warningErr, warning] = getValue('color', 'color.warning');
	if (!isWarningOk) {
		return Err(warningErr.wrapWith('#ERR_RECONSTRUCT_COLOR_WARNING'));
	}
	const [isWarningContentOk, warningContentErr, warningContent] = getValue(
		'color',
		'color.warningContent'
	);
	if (!isWarningContentOk) {
		return Err(warningContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_WARNING_CONTENT'));
	}
	const [isErrorOk, errorErr, error] = getValue('color', 'color.error');
	if (!isErrorOk) {
		return Err(errorErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ERROR'));
	}
	const [isErrorContentOk, errorContentErr, errorContent] = getValue('color', 'color.errorContent');
	if (!isErrorContentOk) {
		return Err(errorContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ERROR_CONTENT'));
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
			base100,
			base200,
			base300,
			baseContent,
			primary,
			primaryContent,
			secondary,
			secondaryContent,
			neutral,
			neutralContent,
			accent,
			accentContent,
			info,
			infoContent,
			success,
			successContent,
			warning,
			warningContent,
			error,
			errorContent
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
