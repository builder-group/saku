import { TBasicLinkNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TMixinResolveContext } from '../../lib';
import { TResolvedBasicLinkNodeContentMixin } from './types';

export function resolveBasicLinkNodeContentMixin(
	content: TBasicLinkNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedBasicLinkNodeContentMixin['value'], AppError> {
	// Title
	const effectiveTitle =
		content.overrides.title !== undefined ? content.overrides.title : content.metadata?.title;
	const resolvedTitle =
		effectiveTitle != null && effectiveTitle.length > 0 ? effectiveTitle : undefined;

	// Description
	const effectiveDescription =
		content.overrides.description !== undefined
			? content.overrides.description
			: content.metadata?.description;
	const resolvedDescription =
		effectiveDescription != null && effectiveDescription.length > 0
			? effectiveDescription
			: undefined;

	// Thumbnail
	const effectiveThumbnail =
		content.overrides.thumbnail !== undefined
			? content.overrides.thumbnail
			: content.metadata?.thumbnail;
	const resolvedThumbnail =
		effectiveThumbnail != null ? resolveAsset(effectiveThumbnail, cx.node.site) : undefined;

	return Ok({
		type: 'basic',
		url: content.url,
		title: resolvedTitle,
		description: resolvedDescription,
		thumbnail: resolvedThumbnail
	});
}
