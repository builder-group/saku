import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { getThemeSettings } from '@/lib/gql/theme-settings';

export async function getParsedThemeSettings(
	themeId: string,
	config: TGetParsedThemeSettingsConfig
): Promise<TResult<TGetParsedThemeSettingsSuccess, AppError>> {
	const result = await getThemeSettings({ id: themeId }, config);
	if (result.isErr()) {
		return Err(result.error);
	}

	const { theme, files } = result.value;
	const settingsDataContent = files['settings_data.json'];
	const settingsSchemaContent = files['settings_schema.json'];

	let settingsData: TThemeSettingsData | null = null;
	let settingsSchema: TThemeSettingsSchema | null = null;
	try {
		if (settingsDataContent) {
			settingsData = JSON.parse(settingsDataContent);
		}
		if (settingsSchemaContent) {
			settingsSchema = JSON.parse(settingsSchemaContent);
		}
	} catch (error) {
		return Err(
			new AppError('#ERR_THEME_SETTINGS_PARSE_ERROR', 500, {
				detail: `Failed to parse theme settings: ${error instanceof Error ? error.message : 'Unknown error'}`
			})
		);
	}

	return Ok({
		theme,
		settingsData,
		settingsSchema
	});
}

export interface TGetParsedThemeSettingsConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetParsedThemeSettingsSuccess {
	theme: {
		id: string;
		name: string;
		role: string;
	};
	settingsData: TThemeSettingsData | null;
	settingsSchema: TThemeSettingsSchema | null;
}

export interface TThemeSettingsData {
	current: Record<string, any>;
	presets?: Record<string, Record<string, any>>;
	platform_customizations?: Record<string, any>;
}

export interface TThemeSettingsSchema {
	theme_info?: {
		theme_name: string;
		theme_version: string;
		theme_author: string;
		theme_documentation_url: string;
		theme_support_url?: string;
		theme_support_email?: string;
	};
	settings?: TThemeSetting[];
}

export interface TThemeSetting {
	name: string;
	settings?: TThemeSettingField[];
}

export interface TThemeSettingField {
	type: string;
	id: string;
	label: string;
	default?: any;
	options?: Array<{ value: string; label: string }>;
	min?: number;
	max?: number;
	step?: number;
	unit?: string;
	info?: string;
	placeholder?: string;
	content?: string;
}
