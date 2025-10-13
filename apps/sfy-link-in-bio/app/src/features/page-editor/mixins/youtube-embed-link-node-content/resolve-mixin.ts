import { createYouTubeEmbedUrl, TYouTubeEmbedLinkNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { TResolvedYouTubeEmbedLinkNodeContentMixin } from './types';

export function resolveYouTubeEmbedLinkNodeContentMixin(
	content: TYouTubeEmbedLinkNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedYouTubeEmbedLinkNodeContentMixin['value'], AppError> {
	return Ok({
		type: 'youtube-embed',
		url: content.url,
		embedUrl: createYouTubeEmbedUrl(content.contentType, content.contentId)
	});
}
