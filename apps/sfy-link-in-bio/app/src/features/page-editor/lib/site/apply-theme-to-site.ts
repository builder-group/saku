import {
	createId,
	createTokensFromTheme,
	fontMetadataMap,
	getFontHash,
	getFontMetadataByFamily,
	isTokenRef,
	mapTokenRef,
	TFlatSite,
	TTheme
} from '@repo/editor';

/**
 * Applies a theme to an existing flat site by:
 * 1. Adding theme font assets to the site
 * 2. Applying theme tokens to the site
 * 3. Updating the root node's background color and gap
 */
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

	// Apply theme tokens (theme tokens take precedence)
	const themeTokens = createTokensFromTheme(theme);
	themeTokens.forEach((token) => {
		site.tokens[token.key] = token;
	});

	// Update root node with theme background and gap
	const rootNode = site.nodes[site.rootId];
	if (rootNode != null && rootNode.type === 'page') {
		site.nodes[site.rootId] = {
			...rootNode,
			autoLayout: {
				...rootNode.autoLayout,
				verticalGap:
					theme.gap ??
					(isTokenRef(rootNode.autoLayout)
						? mapTokenRef(rootNode.autoLayout, 'verticalGap')
						: rootNode.autoLayout.verticalGap)
			},
			fill: {
				paint: theme.paint.base200,
				opacity: 1
			}
		};
	}

	return site;
}
