import { TToken } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TTheme } from '../../environment';

export function reconstructThemeFromTokens(tokens: TToken[]): TResult<TTheme, AppError> {
	// Create a map for easy lookup
	const tokenMap = new Map(
		tokens.filter((token) => token.type === 'variable').map((token) => [token.key, token.value])
	);

	// Helper to get required value or return error
	const getRequired = (key: string): TResult<string | number, AppError> => {
		const value = tokenMap.get(key);
		if (value == null) {
			return Err(
				new AppError('#ERR_MISSING_REQUIRED_TOKEN', {
					detail: `Missing required token: ${key}`
				})
			);
		}
		if (typeof value !== 'string' && typeof value !== 'number') {
			return Err(
				new AppError('#ERR_INVALID_TOKEN_VALUE_TYPE', {
					detail: `Invalid token value type for ${key}: expected string or number, got ${typeof value}`
				})
			);
		}
		return Ok(value);
	};

	// Helper to get optional value with fallback
	const getOptional = (key: string, fallback: string | number): string | number => {
		const value = tokenMap.get(key);
		if (value == null) {
			return fallback;
		}
		if (typeof value !== 'string' && typeof value !== 'number') {
			return fallback;
		}
		return value;
	};

	// Get required theme properties
	const [isKeyOk, keyErr, key] = getRequired('theme.key');
	if (!isKeyOk) {
		return Err(keyErr.wrapWith('#ERR_RECONSTRUCT_THEME_KEY'));
	}
	const [isNameOk, nameErr, name] = getRequired('theme.name');
	if (!isNameOk) {
		return Err(nameErr.wrapWith('#ERR_RECONSTRUCT_THEME_NAME'));
	}

	// Get required color properties
	const [isBase100Ok, base100Err, base100] = getRequired('color.base100');
	if (!isBase100Ok) {
		return Err(base100Err.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE100'));
	}
	const [isBase200Ok, base200Err, base200] = getRequired('color.base200');
	if (!isBase200Ok) {
		return Err(base200Err.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE200'));
	}
	const [isBase300Ok, base300Err, base300] = getRequired('color.base300');
	if (!isBase300Ok) {
		return Err(base300Err.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE300'));
	}
	const [isBaseContentOk, baseContentErr, baseContent] = getRequired('color.baseContent');
	if (!isBaseContentOk) {
		return Err(baseContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_BASE_CONTENT'));
	}
	const [isPrimaryOk, primaryErr, primary] = getRequired('color.primary');
	if (!isPrimaryOk) {
		return Err(primaryErr.wrapWith('#ERR_RECONSTRUCT_COLOR_PRIMARY'));
	}
	const [isPrimaryContentOk, primaryContentErr, primaryContent] =
		getRequired('color.primaryContent');
	if (!isPrimaryContentOk) {
		return Err(primaryContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_PRIMARY_CONTENT'));
	}
	const [isSecondaryOk, secondaryErr, secondary] = getRequired('color.secondary');
	if (!isSecondaryOk) {
		return Err(secondaryErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SECONDARY'));
	}
	const [isSecondaryContentOk, secondaryContentErr, secondaryContent] =
		getRequired('color.secondaryContent');
	if (!isSecondaryContentOk) {
		return Err(secondaryContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SECONDARY_CONTENT'));
	}
	const [isNeutralOk, neutralErr, neutral] = getRequired('color.neutral');
	if (!isNeutralOk) {
		return Err(neutralErr.wrapWith('#ERR_RECONSTRUCT_COLOR_NEUTRAL'));
	}
	const [isNeutralContentOk, neutralContentErr, neutralContent] =
		getRequired('color.neutralContent');
	if (!isNeutralContentOk) {
		return Err(neutralContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_NEUTRAL_CONTENT'));
	}
	const [isAccentOk, accentErr, accent] = getRequired('color.accent');
	if (!isAccentOk) {
		return Err(accentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ACCENT'));
	}
	const [isAccentContentOk, accentContentErr, accentContent] = getRequired('color.accentContent');
	if (!isAccentContentOk) {
		return Err(accentContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ACCENT_CONTENT'));
	}
	const [isInfoOk, infoErr, info] = getRequired('color.info');
	if (!isInfoOk) {
		return Err(infoErr.wrapWith('#ERR_RECONSTRUCT_COLOR_INFO'));
	}
	const [isInfoContentOk, infoContentErr, infoContent] = getRequired('color.infoContent');
	if (!isInfoContentOk) {
		return Err(infoContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_INFO_CONTENT'));
	}
	const [isSuccessOk, successErr, success] = getRequired('color.success');
	if (!isSuccessOk) {
		return Err(successErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SUCCESS'));
	}
	const [isSuccessContentOk, successContentErr, successContent] =
		getRequired('color.successContent');
	if (!isSuccessContentOk) {
		return Err(successContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_SUCCESS_CONTENT'));
	}
	const [isWarningOk, warningErr, warning] = getRequired('color.warning');
	if (!isWarningOk) {
		return Err(warningErr.wrapWith('#ERR_RECONSTRUCT_COLOR_WARNING'));
	}
	const [isWarningContentOk, warningContentErr, warningContent] =
		getRequired('color.warningContent');
	if (!isWarningContentOk) {
		return Err(warningContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_WARNING_CONTENT'));
	}
	const [isErrorOk, errorErr, error] = getRequired('color.error');
	if (!isErrorOk) {
		return Err(errorErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ERROR'));
	}
	const [isErrorContentOk, errorContentErr, errorContent] = getRequired('color.errorContent');
	if (!isErrorContentOk) {
		return Err(errorContentErr.wrapWith('#ERR_RECONSTRUCT_COLOR_ERROR_CONTENT'));
	}

	// Get required typography properties
	const [isHeadingFontFamilyOk, headingFontFamilyErr, headingFontFamily] = getRequired(
		'typography.heading.fontFamily'
	);
	if (!isHeadingFontFamilyOk) {
		return Err(headingFontFamilyErr.wrapWith('#ERR_RECONSTRUCT_TYPOGRAPHY_HEADING_FONT_FAMILY'));
	}
	const [isHeadingFontWeightOk, headingFontWeightErr, headingFontWeight] = getRequired(
		'typography.heading.fontWeight'
	);
	if (!isHeadingFontWeightOk) {
		return Err(headingFontWeightErr.wrapWith('#ERR_RECONSTRUCT_TYPOGRAPHY_HEADING_FONT_WEIGHT'));
	}
	const [isTextFontFamilyOk, textFontFamilyErr, textFontFamily] = getRequired(
		'typography.text.fontFamily'
	);
	if (!isTextFontFamilyOk) {
		return Err(textFontFamilyErr.wrapWith('#ERR_RECONSTRUCT_TYPOGRAPHY_TEXT_FONT_FAMILY'));
	}
	const [isTextFontWeightOk, textFontWeightErr, textFontWeight] = getRequired(
		'typography.text.fontWeight'
	);
	if (!isTextFontWeightOk) {
		return Err(textFontWeightErr.wrapWith('#ERR_RECONSTRUCT_TYPOGRAPHY_TEXT_FONT_WEIGHT'));
	}

	// Get required spacing properties
	const [isGapOk, gapErr, gap] = getRequired('spacing.gap');
	if (!isGapOk) {
		return Err(gapErr.wrapWith('#ERR_RECONSTRUCT_SPACING_GAP'));
	}

	// Get required size properties
	const [isTextSizeOk, textSizeErr, textSize] = getRequired('size.text');
	if (!isTextSizeOk) {
		return Err(textSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_TEXT'));
	}
	const [isBoxSizeOk, boxSizeErr, boxSize] = getRequired('size.box');
	if (!isBoxSizeOk) {
		return Err(boxSizeErr.wrapWith('#ERR_RECONSTRUCT_SIZE_BOX'));
	}

	// Get required radius properties
	const [isBoxRadiusOk, boxRadiusErr, boxRadius] = getRequired('radius.box');
	if (!isBoxRadiusOk) {
		return Err(boxRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_BOX'));
	}
	const [isFieldRadiusOk, fieldRadiusErr, fieldRadius] = getRequired('radius.field');
	if (!isFieldRadiusOk) {
		return Err(fieldRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_FIELD'));
	}
	const [isSelectorRadiusOk, selectorRadiusErr, selectorRadius] = getRequired('radius.selector');
	if (!isSelectorRadiusOk) {
		return Err(selectorRadiusErr.wrapWith('#ERR_RECONSTRUCT_RADIUS_SELECTOR'));
	}

	// Get required effects properties
	const [isStrokeWidthOk, strokeWidthErr, strokeWidth] = getRequired('effects.stroke.width');
	if (!isStrokeWidthOk) {
		return Err(strokeWidthErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_STROKE_WIDTH'));
	}
	const [isShadowBlurOk, shadowBlurErr, shadowBlur] = getRequired('effects.shadow.blur');
	if (!isShadowBlurOk) {
		return Err(shadowBlurErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_BLUR'));
	}
	const [isShadowOffsetXOk, shadowOffsetXErr, shadowOffsetX] =
		getRequired('effects.shadow.offsetX');
	if (!isShadowOffsetXOk) {
		return Err(shadowOffsetXErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_OFFSET_X'));
	}
	const [isShadowOffsetYOk, shadowOffsetYErr, shadowOffsetY] =
		getRequired('effects.shadow.offsetY');
	if (!isShadowOffsetYOk) {
		return Err(shadowOffsetYErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_OFFSET_Y'));
	}
	const [isShadowSpreadOk, shadowSpreadErr, shadowSpread] = getRequired('effects.shadow.spread');
	if (!isShadowSpreadOk) {
		return Err(shadowSpreadErr.wrapWith('#ERR_RECONSTRUCT_EFFECTS_SHADOW_SPREAD'));
	}

	// Reconstruct theme
	return Ok({
		key: key as string,
		name: name as string,
		color: {
			base100: base100 as `#${string}`,
			base200: base200 as `#${string}`,
			base300: base300 as `#${string}`,
			baseContent: baseContent as `#${string}`,
			primary: primary as `#${string}`,
			primaryContent: primaryContent as `#${string}`,
			secondary: secondary as `#${string}`,
			secondaryContent: secondaryContent as `#${string}`,
			neutral: neutral as `#${string}`,
			neutralContent: neutralContent as `#${string}`,
			accent: accent as `#${string}`,
			accentContent: accentContent as `#${string}`,
			info: info as `#${string}`,
			infoContent: infoContent as `#${string}`,
			success: success as `#${string}`,
			successContent: successContent as `#${string}`,
			warning: warning as `#${string}`,
			warningContent: warningContent as `#${string}`,
			error: error as `#${string}`,
			errorContent: errorContent as `#${string}`
		},
		typography: {
			heading: {
				fontFamily: headingFontFamily as string,
				fontWeight: headingFontWeight as 400 | 500 | 600 | 700
			},
			text: {
				fontFamily: textFontFamily as string,
				fontWeight: textFontWeight as 300 | 400 | 500
			}
		},
		gap: gap as number,
		size: {
			text: textSize as number,
			box: boxSize as number,
			field: getOptional('size.field', 1) as number,
			selector: getOptional('size.selector', 1) as number
		},
		radius: {
			box: boxRadius as number,
			field: fieldRadius as number,
			selector: selectorRadius as number
		},
		effects: {
			stroke: {
				width: strokeWidth as number
			},
			shadow: {
				blur: shadowBlur as number,
				offsetX: shadowOffsetX as number,
				offsetY: shadowOffsetY as number,
				spread: shadowSpread as number
			}
		}
	} satisfies TTheme);
}
