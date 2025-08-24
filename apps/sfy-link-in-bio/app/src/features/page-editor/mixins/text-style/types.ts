import { TMixin } from '@repo/editor';
import { TResolvedAppearanceStyleMixin } from '../appearance-style';
import { TResolvedTypographyStyleMixin } from '../typography-style';

export type TResolvedTextStyleMixin = TMixin<
	'text',
	{
		appearance: TResolvedAppearanceStyleMixin['value'];
		typography: TResolvedTypographyStyleMixin['value'];
	}
>;
