import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { getThemes } from '../../gql';

export async function getMainTheme(
	config: TGetMainThemeConfig
): Promise<TResult<TGetMainThemeSuccess, AppError>> {
	const result = await getThemes({ roles: ['MAIN'] }, config);
	if (result.isErr()) {
		return Err(result.error);
	}

	const mainTheme = result.value.themes.find((theme) => theme.role === 'MAIN');
	if (mainTheme == null) {
		return Err(
			new AppError('#ERR_MAIN_THEME_NOT_FOUND', 404, {
				detail: 'Main theme not found'
			})
		);
	}

	return Ok({
		id: mainTheme.id,
		name: mainTheme.name,
		role: mainTheme.role
	});
}

export interface TGetMainThemeConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetMainThemeSuccess {
	id: string;
	name: string;
	role: string;
}
