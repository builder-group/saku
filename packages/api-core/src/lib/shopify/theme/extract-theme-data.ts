import {
	extractFont,
	extractNumber,
	extractSocialLinks,
	extractString,
	extractUrl
} from '@/lib/shopify/theme/extract';
import type { TThemeSettingsData } from './get-parsed-theme-settings-data';

export function extractThemeDataFromSettings(
	settingsData: TThemeSettingsData | null
): TExtractedThemeData {
	if (settingsData?.presets == null) {
		return {
			socialLinks: [],
			colors: {},
			typography: {},
			layout: {}
		};
	}

	// Handle current field which can be either a string (preset name) or object (customized settings)
	let preset: Record<string, any> | null = null;
	if (typeof settingsData.current === 'string') {
		// Current is a preset name, get the preset
		preset = settingsData.presets[settingsData.current] ?? settingsData.presets['Default'] ?? null;
	} else if (settingsData.current != null && typeof settingsData.current === 'object') {
		// Current is customized settings object
		preset = settingsData.current;
	} else {
		// Fallback to Default preset
		preset = settingsData.presets['Default'] ?? null;
	}

	if (preset == null) {
		return {
			socialLinks: [],
			colors: {},
			typography: {},
			layout: {}
		};
	}

	return {
		socialLinks: extractSocialLinks(preset),
		logo: extractUrl(preset, ['logo', 'shop_logo', 'brand_logo', 'logo_image', 'logo_url']),
		colors: {
			primary: extractString(preset, [
				'colors_accent_1',
				'color_accent_1',
				'primary_color',
				'accent_color',
				'brand_color'
			]),
			secondary: extractString(preset, [
				'colors_accent_2',
				'color_accent_2',
				'secondary_color',
				'accent_color_2'
			]),
			background: extractString(preset, [
				'colors_background_1',
				'color_background_1',
				'background_color',
				'bg_color'
			]),
			text: extractString(preset, ['colors_text', 'color_text', 'text_color', 'body_color']),
			button: extractString(preset, [
				'colors_accent_1',
				'color_accent_1',
				'button_color',
				'primary_color'
			]),
			buttonText: extractString(preset, [
				'colors_solid_button_labels',
				'color_button_text',
				'button_text_color',
				'button_label_color'
			])
		},
		typography: {
			headingFont: extractFont(preset, [
				'type_header_font',
				'header_font',
				'heading_font',
				'title_font'
			]),
			bodyFont: extractFont(preset, ['type_body_font', 'body_font', 'text_font', 'content_font'])
		},
		layout: {
			pageWidth: extractNumber(preset, [
				'page_width',
				'container_width',
				'max_width',
				'site_width'
			]),
			spacing: extractNumber(preset, [
				'spacing_sections',
				'section_spacing',
				'content_spacing',
				'spacing'
			]),
			borderRadius: extractNumber(preset, [
				'buttons_radius',
				'button_radius',
				'border_radius',
				'corner_radius'
			])
		}
	};
}

export interface TExtractedColors {
	primary?: string;
	secondary?: string;
	background?: string;
	text?: string;
	button?: string;
	buttonText?: string;
}

export interface TExtractedTypography {
	headingFont?: { family: string; weight: number; style: string };
	bodyFont?: { family: string; weight: number; style: string };
}

export interface TExtractedLayout {
	pageWidth?: number;
	spacing?: number;
	borderRadius?: number;
}

export interface TExtractedThemeData {
	socialLinks: ReturnType<typeof extractSocialLinks>;
	logo?: string;
	colors: TExtractedColors;
	typography: TExtractedTypography;
	layout: TExtractedLayout;
}
