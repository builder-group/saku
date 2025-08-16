import { AppError } from '@repo/hono-utils';
import stripJsonComments from 'strip-json-comments';
import { Err, Ok, type TResult } from 'tuple-result';
import { getThemeSettings } from '../../gql';

export async function getParsedThemeSettingsData(
	themeId: string,
	config: TGetParsedThemeSettingsConfig
): Promise<TResult<TGetParsedThemeSettingsDataSuccess, AppError>> {
	const result = await getThemeSettings({ id: themeId }, config);
	if (result.isErr()) {
		return Err(result.error);
	}

	const { theme, files } = result.value;
	const settingsDataContent = files['settings_data.json'];

	let settingsData: TThemeSettingsData | null = null;
	if (settingsDataContent != null) {
		try {
			settingsData = JSON.parse(stripJsonComments(settingsDataContent));
		} catch (error) {
			return Err(
				new AppError('#ERR_THEME_SETTINGS_PARSE_ERROR', 500, {
					detail: `Failed to parse theme settings: ${error instanceof Error ? error.message : 'Unknown error'}`
				})
			);
		}
	}

	return Ok({
		theme,
		settingsData
	});
}

export interface TGetParsedThemeSettingsConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetParsedThemeSettingsDataSuccess {
	theme: {
		id: string;
		name: string;
		role: string;
	};
	settingsData: TThemeSettingsData | null;
}

export interface TThemeSettingsData {
	current?: string | Record<string, any>;
	presets?: Record<string, Record<string, any>>;
	[key: string]: any;
}
