import { isTokenRef, TTypographyStyleMixin, TUnreferenceTop } from '@repo/editor';

export function unpackTypographyTokenRef(
	typography: TTypographyStyleMixin['value']
): TUnreferenceTop<TTypographyStyleMixin['value']> {
	if (!isTokenRef(typography)) {
		return typography;
	}

	return {
		font: typography,
		fontSize: typography,
		textAlignHorizontal: typography,
		textAlignVertical: typography,
		lineHeight: typography,
		letterSpacing: typography
	};
}

export function packTypographyTokenRef(
	typography: TUnreferenceTop<TTypographyStyleMixin['value']>
): TTypographyStyleMixin['value'] {
	const { font, fontSize, textAlignHorizontal, textAlignVertical, lineHeight, letterSpacing } =
		typography;

	if (
		isTokenRef(font) &&
		isTokenRef(fontSize) &&
		fontSize.key === font.key &&
		isTokenRef(textAlignHorizontal) &&
		textAlignHorizontal.key === font.key &&
		isTokenRef(textAlignVertical) &&
		textAlignVertical.key === font.key &&
		isTokenRef(lineHeight) &&
		lineHeight.key === font.key &&
		isTokenRef(letterSpacing) &&
		letterSpacing.key === font.key
	) {
		return font;
	}

	return typography;
}
