import { createSpotifyEmbedUrl, TSpotifyEmbedLinkNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveColor, TMixinResolveContext } from '../../lib';
import { TResolvedSpotifyEmbedLinkNodeContentMixin } from './types';

export function resolveSpotifyEmbedLinkNodeContentMixin(
	content: TSpotifyEmbedLinkNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedSpotifyEmbedLinkNodeContentMixin['value'], AppError> {
	return Ok({
		type: 'spotify-embed',
		url: content.url,
		embedUrl: createSpotifyEmbedUrl(content.contentType, content.contentId),
		height: content.height,
		theme:
			content.theme != null
				? {
						backgroundBase:
							content.theme.backgroundBase != null
								? resolveColor(content.theme.backgroundBase)
								: undefined,
						backgroundTinted:
							content.theme.backgroundTinted != null
								? resolveColor(content.theme.backgroundTinted)
								: undefined,
						textBase:
							content.theme.textBase != null ? resolveColor(content.theme.textBase) : undefined,
						textSubdued:
							content.theme.textSubdued != null
								? resolveColor(content.theme.textSubdued)
								: undefined
					}
				: undefined
	});
}
