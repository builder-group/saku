import { resolveReference, TAutoLayoutStyleMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TNodeResolveContext } from '../../lib';
import { TResolvedAutoLayoutStyleMixin } from './types';

export function resolveAutoLayoutStyleMixin(
	layout: TAutoLayoutStyleMixin['value'],
	cx: TNodeResolveContext
): TResult<TResolvedAutoLayoutStyleMixin['value'], AppError> {
	const resolvedHorizontalPadding = resolveReference(
		layout.horizontalPadding,
		cx.childMixins?.autoLayout.horizontalPadding
	);
	const resolvedVerticalPadding = resolveReference(
		layout.verticalPadding,
		cx.childMixins?.autoLayout.verticalPadding
	);
	const resolvedHorizontalGap = resolveReference(
		layout.horizontalGap,
		cx.childMixins?.autoLayout.horizontalGap
	);
	const resolvedVerticalGap = resolveReference(
		layout.verticalGap,
		cx.childMixins?.autoLayout.verticalGap
	);

	return Ok({
		horizontalPadding: resolvedHorizontalPadding,
		verticalPadding: resolvedVerticalPadding,
		horizontalGap: resolvedHorizontalGap,
		verticalGap: resolvedVerticalGap,
		styles: {
			padding: `${resolvedVerticalPadding ?? 0}px ${resolvedHorizontalPadding ?? 0}px`,
			gap: `${resolvedVerticalGap ?? 0}px ${resolvedHorizontalGap ?? 0}px`
		}
	});
}

export interface TResolveAutoLayoutStyleMixinParentMixin {
	horizontalPadding?: number;
	verticalPadding?: number;
	horizontalGap?: number;
	verticalGap?: number;
}
