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
	const fontDisplayMetadata =
		getFontMetadataByFamily(theme.typography.display.fontFamily) ?? fontMetadataMap.inter;
	const fontDisplayHash = getFontHash(fontDisplayMetadata.font);
	if (site.assets[fontDisplayHash] == null) {
		site.assets[fontDisplayHash] = {
			id: createId('asset'),
			type: 'font',
			hash: fontDisplayHash,
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: `https://fonts.googleapis.com/css2?family=${fontDisplayMetadata.googleFont}&display=swap`
			},
			font: fontDisplayMetadata.font
		};
	}
	const fontBodyMetadata =
		getFontMetadataByFamily(theme.typography.body.fontFamily) ?? fontMetadataMap.inter;
	const fontBodyHash = getFontHash(fontBodyMetadata.font);
	if (site.assets[fontBodyHash] == null) {
		site.assets[fontBodyHash] = {
			id: createId('asset'),
			type: 'font',
			hash: fontBodyHash,
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: `https://fonts.googleapis.com/css2?family=${fontBodyMetadata.googleFont}&display=swap`
			},
			font: fontBodyMetadata.font
		};
	}

	// Apply theme tokens
	const themeTokens = createThemeTokens(theme);
	themeTokens.forEach((token) => {
		site.tokens[token.key] = token;
	});

	return site;
}
