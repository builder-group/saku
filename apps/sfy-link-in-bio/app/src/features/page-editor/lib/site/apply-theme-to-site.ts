import {
	createId,
	createThemeTokens,
	fontMetadataMap,
	getFontHash,
	getFontMetadataByFamily,
	TFlatSite,
	TTheme
} from '@repo/editor';

export function applyThemeToSite(site: TFlatSite, theme: TTheme): TFlatSite {
	// Add theme fonts to assets if they don't already exist
	const headingFontMetadata =
		getFontMetadataByFamily(theme.typography.heading.fontFamily) ?? fontMetadataMap.inter;
	const headingFontHash = getFontHash(headingFontMetadata.font);
	if (site.assets[headingFontHash] == null) {
		site.assets[headingFontHash] = {
			id: createId('asset'),
			type: 'font',
			hash: headingFontHash,
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: `https://fonts.googleapis.com/css2?family=${headingFontMetadata.googleFont}&display=swap`
			},
			font: headingFontMetadata.font
		};
	}
	const textFontMetadata =
		getFontMetadataByFamily(theme.typography.text.fontFamily) ?? fontMetadataMap.inter;
	const textFontHash = getFontHash(textFontMetadata.font);
	if (site.assets[textFontHash] == null) {
		site.assets[textFontHash] = {
			id: createId('asset'),
			type: 'font',
			hash: textFontHash,
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: `https://fonts.googleapis.com/css2?family=${textFontMetadata.googleFont}&display=swap`
			},
			font: textFontMetadata.font
		};
	}

	// Apply theme tokens
	const themeTokens = createThemeTokens(theme);
	themeTokens.forEach((token) => {
		site.tokens[token.key] = token;
	});

	return site;
}
