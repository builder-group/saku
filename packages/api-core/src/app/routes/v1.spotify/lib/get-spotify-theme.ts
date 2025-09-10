import { cssRgbaToRgba, TRgba } from '@repo/editor';
import { htmlConfig, tokenize, type TXmlToken } from 'xml-tokenizer';
import { fetchClient } from '@/environment';
import { TSpotifyThemeDto } from '../schema';

export async function getSpotifyTheme(url: string): Promise<TSpotifyThemeDto> {
	const result: TSpotifyThemeDto = { url };

	const [isHtmlOk, , html] = await fetchClient.get<string>(url, { parseAs: 'text' });
	if (!isHtmlOk) {
		return result;
	}

	const theme = extractThemeFromHtml(html.data);

	return {
		url,
		theme
	};
}

function extractThemeFromHtml(html: string): Record<string, string | number | TRgba> | undefined {
	let styleAttribute: string | null = null;
	let isInDivElement = false;
	let currentAttributes: Record<string, string> = {};

	tokenize(
		html,
		(token: TXmlToken, stream) => {
			switch (token.type) {
				case 'ElementStart': {
					if (token.local === 'div') {
						isInDivElement = true;
						currentAttributes = {};
					}
					break;
				}
				case 'Attribute': {
					if (isInDivElement) {
						currentAttributes[token.local] = token.value;
					}
					break;
				}
				case 'ElementEnd': {
					if (token.end.type !== 'Open' && token.end.type !== 'Empty') {
						break;
					}

					if (!isInDivElement) {
						break;
					}

					// Check if this div has the embed-widget-container data-testid
					if (
						currentAttributes['data-testid'] === 'embed-widget-container' &&
						currentAttributes['style'] != null
					) {
						styleAttribute = currentAttributes['style'];
						stream.goToEnd();
					}

					isInDivElement = false;
					currentAttributes = {};
					break;
				}

				default:
					break;
			}
		},
		htmlConfig
	);

	if (styleAttribute == null) {
		return undefined;
	}

	return parseThemeFromStyles(styleAttribute);
}

function parseThemeFromStyles(styleString: string): Record<string, string | number | TRgba> {
	const theme: Record<string, string | number | TRgba> = {};

	const cssProperties = styleString.split(';').filter(Boolean);
	for (const property of cssProperties) {
		const colonIndex = property.indexOf(':');
		if (colonIndex === -1) {
			continue;
		}

		const cssName = property.slice(0, colonIndex).trim();
		const value = property.slice(colonIndex + 1).trim();

		if (cssName == null || value == null) {
			continue;
		}

		// Convert CSS custom property name to camelCase
		const camelName = cssToCamelCase(cssName);

		// Try to parse value as number first
		const numberValue = parseFloat(value);
		if (!isNaN(numberValue)) {
			theme[camelName] = numberValue;
			continue;
		}

		// Try to parse as color
		const rgba = cssRgbaToRgba(value);
		if (rgba != null) {
			theme[camelName] = rgba;
			continue;
		}

		// Fallback to string
		theme[camelName] = value;
	}

	return theme;
}

// Remove -- prefix and convert kebab-case to camelCase
function cssToCamelCase(cssName: string): string {
	return cssName.replace(/^--/, '').replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}
