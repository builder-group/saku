import { TTextStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import {
	resolveAppearanceStyleMixin,
	TResolveAppearanceStyleMixinParentMixin
} from '../appearance-style';
import {
	resolveTypographyStyleMixin,
	TResolveTypographyStyleMixinParentMixin
} from '../typography-style';
import { TResolvedTextStyleMixin } from './types';

export function resolveTextStyleMixin(
	text: TTextStyleMixin['value'],
	parentMixin?: TResolveTextStyleMixinParentMixin
): TResult<TResolvedTextStyleMixin['value'], AppError> {
	const [isAppearanceOk, appearanceErr, appearance] = resolveAppearanceStyleMixin(
		text.appearance,
		parentMixin?.appearance
	);
	if (!isAppearanceOk) {
		return Err(appearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isTypographyOk, typographyErr, typography] = resolveTypographyStyleMixin(
		text.typography,
		parentMixin?.typography
	);
	if (!isTypographyOk) {
		return Err(typographyErr.wrapWith('#ERR_RESOLVE_TYPOGRAPHY_STYLE'));
	}

	return Ok({
		appearance,
		typography
	});
}

export interface TResolveTextStyleMixinParentMixin {
	appearance: TResolveAppearanceStyleMixinParentMixin;
	typography: TResolveTypographyStyleMixinParentMixin;
}
