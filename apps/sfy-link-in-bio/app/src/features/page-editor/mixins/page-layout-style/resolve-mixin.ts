import { TPageLayoutStyleMixin } from '@repo/editor';
import { TResolvedPageLayoutStyleMixin } from './types';

export function resolvePageLayoutStyleMixin(
	layout: TPageLayoutStyleMixin['value']
): TResolvedPageLayoutStyleMixin['value'] {
	return {
		spacing: layout.spacing,
		styles: {
			gap: `${layout.spacing}px`
		}
	};
}
