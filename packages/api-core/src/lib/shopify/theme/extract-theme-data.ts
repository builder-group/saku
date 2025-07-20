import type { TThemeSettingsData } from './get-parsed-theme-settings-data';

export interface TExtractedSocialLinks {
	platform: string;
	url: string;
	username?: string;
}

export interface TExtractedColors {
	primary: string;
	secondary: string;
	background: string;
	text: string;
	button: string;
	buttonText: string;
}

export interface TExtractedTypography {
	headingFont: string;
	bodyFont: string;
	headingScale: number;
	bodyScale: number;
}

export interface TExtractedLayout {
	pageWidth: number;
	spacing: number;
	borderRadius: number;
}

export interface TExtractedThemeData {
	socialLinks: TExtractedSocialLinks[];
	colors: TExtractedColors;
	typography: TExtractedTypography;
	layout: TExtractedLayout;
}

export function extractSocialLinks(
	settingsData: TThemeSettingsData | null
): TExtractedSocialLinks[] {
	if (!settingsData?.presets?.['Default']) {
		return [];
	}

	const preset = settingsData.presets['Default'];
	const socialLinks: TExtractedSocialLinks[] = [];

	// Define social media platforms and their field mappings
	const socialPlatforms = [
		{ field: 'social_facebook_link', platform: 'facebook' },
		{ field: 'social_instagram_link', platform: 'instagram' },
		{ field: 'social_youtube_link', platform: 'youtube' },
		{ field: 'social_tiktok_link', platform: 'tiktok' },
		{ field: 'social_twitter_link', platform: 'twitter' },
		{ field: 'social_snapchat_link', platform: 'snapchat' },
		{ field: 'social_pinterest_link', platform: 'pinterest' },
		{ field: 'social_tumblr_link', platform: 'tumblr' },
		{ field: 'social_vimeo_link', platform: 'vimeo' }
	];

	for (const { field, platform } of socialPlatforms) {
		const url = preset[field];
		if (url && typeof url === 'string' && url.trim() !== '') {
			// Extract username from URL if possible
			let username: string | undefined;
			try {
				const urlObj = new URL(url);
				username = urlObj.pathname.split('/').filter(Boolean).pop();
			} catch {
				// If URL parsing fails, try to extract username from the URL string
				const match = url.match(/(?:\.com|\.org|\.net)\/([^\/\?]+)/);
				username = match?.[1];
			}

			socialLinks.push({
				platform,
				url,
				username
			});
		}
	}

	return socialLinks;
}

export function extractColors(settingsData: TThemeSettingsData | null): TExtractedColors {
	if (!settingsData?.presets?.['Default']) {
		return {
			primary: '#121212',
			secondary: '#666666',
			background: '#ffffff',
			text: '#121212',
			button: '#121212',
			buttonText: '#ffffff'
		};
	}

	const preset = settingsData.presets['Default'];

	return {
		primary: preset['colors_accent_1'] || '#121212',
		secondary: preset['colors_accent_2'] || '#666666',
		background: preset['colors_background_1'] || '#ffffff',
		text: preset['colors_text'] || '#121212',
		button: preset['colors_accent_1'] || '#121212',
		buttonText: preset['colors_solid_button_labels'] || '#ffffff'
	};
}

export function extractTypography(settingsData: TThemeSettingsData | null): TExtractedTypography {
	if (!settingsData?.presets?.['Default']) {
		return {
			headingFont: 'Assistant',
			bodyFont: 'Assistant',
			headingScale: 100,
			bodyScale: 100
		};
	}

	const preset = settingsData.presets['Default'];

	// Convert Shopify font identifiers to readable names
	function getFontName(fontId: string): string {
		const fontMap: Record<string, string> = {
			helvetica_n7: 'Helvetica',
			helvetica_n4: 'Helvetica',
			assistant_n4: 'Assistant',
			assistant_n7: 'Assistant',
			arial_n4: 'Arial',
			arial_n7: 'Arial',
			georgia_n4: 'Georgia',
			georgia_n7: 'Georgia',
			times_new_roman_n4: 'Times New Roman',
			times_new_roman_n7: 'Times New Roman'
		};
		return fontMap[fontId] || fontId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
	}

	return {
		headingFont: getFontName(preset['type_header_font'] || 'assistant_n4'),
		bodyFont: getFontName(preset['type_body_font'] || 'assistant_n4'),
		headingScale: preset['heading_scale'] || 100,
		bodyScale: preset['body_scale'] || 100
	};
}

export function extractLayout(settingsData: TThemeSettingsData | null): TExtractedLayout {
	if (!settingsData?.presets?.['Default']) {
		return {
			pageWidth: 1200,
			spacing: 0,
			borderRadius: 0
		};
	}

	const preset = settingsData.presets['Default'];

	return {
		pageWidth: preset['page_width'] || 1200,
		spacing: preset['spacing_sections'] || 0,
		borderRadius: preset['buttons_radius'] || 0
	};
}

export function extractThemeDataFromSettings(
	settingsData: TThemeSettingsData | null
): TExtractedThemeData {
	return {
		socialLinks: extractSocialLinks(settingsData),
		colors: extractColors(settingsData),
		typography: extractTypography(settingsData),
		layout: extractLayout(settingsData)
	};
}
