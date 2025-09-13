import { Err, Ok, TResult } from 'tuple-result';
import { TTheme } from '../environment';
import { TToken } from '../types';
import { isRgba, rgbaToHex } from './color';
import { EditorError } from './EditorError';

export function reconstructThemeFromTokens(tokens: TToken[]): TResult<TTheme, EditorError> {
	// Create a map for easy lookup
	const tokenMap = new Map(
		tokens.filter((token) => token.type === 'variable').map((token) => [token.key, token.value])
	);

	// Helper to get string value with optional default
	const getString = (key: string, defaultValue?: string): TResult<string, EditorError> => {
		const value = tokenMap.get(key);
		if (value == null) {
			if (defaultValue != null) {
				return Ok(defaultValue);
			}
			return Err(
				new EditorError('#ERR_MISSING_REQUIRED_TOKEN', {
					detail: `Missing required token: ${key}`
				})
			);
		}
		if (typeof value !== 'string') {
			return Err(
				new EditorError('#ERR_INVALID_TOKEN_VALUE_TYPE', {
					detail: `Invalid token value type for ${key}: expected string, got ${typeof value}`
				})
			);
		}
		return Ok(value);
	};

	// Helper to get number value with optional default
	const getNumber = (key: string, defaultValue?: number): TResult<number, EditorError> => {
		const value = tokenMap.get(key);
		if (value == null) {
			if (defaultValue != null) {
				return Ok(defaultValue);
			}
			return Err(
				new EditorError('#ERR_MISSING_REQUIRED_TOKEN', {
					detail: `Missing required token: ${key}`
				})
			);
		}
		if (typeof value !== 'number') {
			return Err(
				new EditorError('#ERR_INVALID_TOKEN_VALUE_TYPE', {
					detail: `Invalid token value type for ${key}: expected number, got ${typeof value}`
				})
			);
		}
		return Ok(value);
	};

	// Helper to get color value with optional default
	const getColor = (
		key: string,
		defaultValue?: `#${string}`
	): TResult<`#${string}`, EditorError> => {
		const value = tokenMap.get(key);
		if (value == null) {
			if (defaultValue != null) {
				return Ok(defaultValue);
			}
			return Err(
				new EditorError('#ERR_MISSING_REQUIRED_TOKEN', {
					detail: `Missing required token: ${key}`
				})
			);
		}
		if (isRgba(value)) {
			return Ok(rgbaToHex(value));
		}
		return Err(
			new EditorError('#ERR_INVALID_COLOR_TOKEN_VALUE_TYPE', {
				detail: `Invalid color token value type for ${key}: expected TRgba object, got ${typeof value}`
			})
		);
	};

	// Get theme properties
	const [isKeyOk, keyErr, key] = getString('theme.key');
	if (!isKeyOk) {
		return Err(keyErr.wrapWith('#ERR_RECONSTRUCT_THEME_KEY'));
	}
	const [isNameOk, nameErr, name] = getString('theme.name');
	if (!isNameOk) {
		return Err(nameErr.wrapWith('#ERR_RECONSTRUCT_THEME_NAME'));
	}

	// Get color properties
	const [isBase100Ok, base100Err, base100] = getColor('color.base100');
	if (!isBase100Ok) {
		return Err(base100Err.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE100'));
	}
	const [isBase200Ok, base200Err, base200] = getColor('color.base200');
	if (!isBase200Ok) {
		return Err(base200Err.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE200'));
	}
	const [isBase300Ok, base300Err, base300] = getColor('color.base300');
	if (!isBase300Ok) {
		return Err(base300Err.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE300'));
	}
	const [isBaseContentOk, baseContentErr, baseContent] = getColor('color.baseContent');
	if (!isBaseContentOk) {
		return Err(baseContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE_CONTENT'));
	}
	const [isPrimaryOk, primaryErr, primary] = getColor('color.primary');
	if (!isPrimaryOk) {
		return Err(primaryErr.wrapWith('#ERR_RECONSTRUCT_COLOR_PRIMARY'));
	}
	const [isPrimaryContentOk, primaryContentErr, primaryContent] = getColor('color.primaryContent');
	if (!isPrimaryContentOk) {
		return Err(primaryContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_PRIMARY_CONTENT'));
	}
	const [isSecondaryOk, secondaryErr, secondary] = getColor('color.secondary');
	if (!isSecondaryOk) {
		return Err(secondaryErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SECONDARY'));
	}
	const [isSecondaryContentOk, secondaryContentErr, secondaryContent] =
		getColor('color.secondaryContent');
	if (!isSecondaryContentOk) {
		return Err(secondaryContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SECONDARY_CONTENT'));
	}
	const [isNeutralOk, neutralErr, neutral] = getColor('color.neutral');
	if (!isNeutralOk) {
		return Err(neutralErr.wrapWith('#ERR_RECONSTRUCT_COLOR_NEUTRAL'));
	}
	const [isNeutralContentOk, neutralContentErr, neutralContent] = getColor('color.neutralContent');
	if (!isNeutralContentOk) {
		return Err(neutralContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_NEUTRAL_CONTENT'));
	}
	const [isAccentOk, accentErr, accent] = getColor('color.accent');
	if (!isAccentOk) {
		return Err(accentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ACCENT'));
	}
	const [isAccentContentOk, accentContentErr, accentContent] = getColor('color.accentContent');
	if (!isAccentContentOk) {
		return Err(accentContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ACCENT_CONTENT'));
	}
	const [isInfoOk, infoErr, info] = getColor('color.info');
	if (!isInfoOk) {
		return Err(infoErr.wrapWith('#ERR_RECONSTRUCT_COLOR_INFO'));
	}
	const [isInfoContentOk, infoContentErr, infoContent] = getColor('color.infoContent');
	if (!isInfoContentOk) {
		return Err(infoContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_INFO_CONTENT'));
	}
	const [isSuccessOk, successErr, success] = getColor('color.success');
	if (!isSuccessOk) {
		return Err(successErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SUCCESS'));
	}
	const [isSuccessContentOk, successContentErr, successContent] = getColor('color.successContent');
	if (!isSuccessContentOk) {
		return Err(successContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SUCCESS_CONTENT'));
	}
	const [isWarningOk, warningErr, warning] = getColor('color.warning');
	if (!isWarningOk) {
		return Err(warningErr.wrapWith('#ERR_RECONSTRUCT_COLOR_WARNING'));
	}
	const [isWarningContentOk, warningContentErr, warningContent] = getColor('color.warningContent');
	if (!isWarningContentOk) {
		return Err(warningContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_WARNING_CONTENT'));
	}
	const [isErrorOk, errorErr, error] = getColor('color.error');
	if (!isErrorOk) {
		return Err(errorErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ERROR'));
	}
	const [isErrorContentOk, errorContentErr, errorContent] = getColor('color.errorContent');
	if (!isErrorContentOk) {
		return Err(errorContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ERROR_CONTENT'));
	}

	// Get typography properties
	const [isHeadingFontFamilyOk, headingFontFamilyErr, headingFontFamily] = getString(
		'typography.heading.fontFamily'
	);
	if (!isHeadingFontFamilyOk) {
		return Err(headingFontFamilyErr.wrapWith('#ERR_RECONSTRUCT_TYPOGRAPHY_HEADING_FONT_FAMILY'));
	}
	const [isHeadingFontWeightOk, headingFontWeightErr, headingFontWeight] = getNumber(
		'typography.heading.fontWeight'
	);
	if (!isHeadingFontWeightOk) {
		return Err(headingFontWeightErr.wrapWith('#ERR_RECONSTRUCT_TYPOGRAPHY_HEADING_FONT_WEIGHT'));
	}
	const [isTextFontFamilyOk, textFontFamilyErr, textFontFamily] = getString(
		'typography.text.fontFamily'
	);
	if (!isTextFontFamilyOk) {
		return Err(textFontFamilyErr.wrapWith('#ERR_RECONSTRUCT_TYPOGRAPHY_TEXT_FONT_FAMILY'));
	}
	const [isTextFontWeightOk, textFontWeightErr, textFontWeight] = getNumber(
		'typography.text.fontWeight'
	);
	if (!isTextFontWeightOk) {
		return Err(textFontWeightErr.wrapWith('#ERR_RECONSTRUCT_TYPOGRAPHY_TEXT_FONT_WEIGHT'));
	}

	// Get spacing properties
	const [isGapOk, gapErr, gap] = getNumber('spacing.gap');
	if (!isGapOk) {
		return Err(gapErr.wrapWith('#ERR_RECONSTRUCT_SPACING_GAP'));
	}

	// Get size properties
	const [isTextSizeOk, textSizeErr, textSize] = getNumber('size.text');
	if (!isTextSizeOk) {
		return Err(textSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_TEXT'));
	}
	const [isBoxSizeOk, boxSizeErr, boxSize] = getNumber('size.box');
	if (!isBoxSizeOk) {
		return Err(boxSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_BOX'));
	}
	const [isFieldSizeOk, fieldSizeErr, fieldSize] = getNumber('size.field', 1);
	if (!isFieldSizeOk) {
		return Err(fieldSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_FIELD'));
	}
	const [isSelectorSizeOk, selectorSizeErr, selectorSize] = getNumber('size.selector', 1);
	if (!isSelectorSizeOk) {
		return Err(selectorSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_SELECTOR'));
	}

	// Get radius properties
	const [isBoxRadiusOk, boxRadiusErr, boxRadius] = getNumber('radius.box');
	if (!isBoxRadiusOk) {
		return Err(boxRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_BOX'));
	}
	const [isFieldRadiusOk, fieldRadiusErr, fieldRadius] = getNumber('radius.field');
	if (!isFieldRadiusOk) {
		return Err(fieldRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_FIELD'));
	}
	const [isSelectorRadiusOk, selectorRadiusErr, selectorRadius] = getNumber('radius.selector');
	if (!isSelectorRadiusOk) {
		return Err(selectorRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_SELECTOR'));
	}

	// Get required effects properties
	const [isStrokeWidthOk, strokeWidthErr, strokeWidth] = getNumber('effects.stroke.width');
	if (!isStrokeWidthOk) {
		return Err(strokeWidthErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_STROKE_WIDTH'));
	}
	const [isShadowBlurOk, shadowBlurErr, shadowBlur] = getNumber('effects.shadow.blur');
	if (!isShadowBlurOk) {
		return Err(shadowBlurErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_BLUR'));
	}
	const [isShadowOffsetXOk, shadowOffsetXErr, shadowOffsetX] = getNumber('effects.shadow.offsetX');
	if (!isShadowOffsetXOk) {
		return Err(shadowOffsetXErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_OFFSET_X'));
	}
	const [isShadowOffsetYOk, shadowOffsetYErr, shadowOffsetY] = getNumber('effects.shadow.offsetY');
	if (!isShadowOffsetYOk) {
		return Err(shadowOffsetYErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_OFFSET_Y'));
	}
	const [isShadowSpreadOk, shadowSpreadErr, shadowSpread] = getNumber('effects.shadow.spread');
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
				fontFamily: headingFontFamily,
				fontWeight: headingFontWeight as 400 | 500 | 600 | 700
			},
			text: {
				fontFamily: textFontFamily,
				fontWeight: textFontWeight as 300 | 400 | 500
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
