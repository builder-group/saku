import { TBasicLinkNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TMixinResolveContext } from '../../lib';
import { TResolvedBasicLinkNodeContentMixin } from './types';

export function resolveBasicLinkNodeContentMixin(
	content: TBasicLinkNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedBasicLinkNodeContentMixin['value'], AppError> {
	const thumbnail = content.userThumbnail !== undefined ? content.userThumbnail : content.thumbnail;
	const title = content.userTitle !== undefined ? content.userTitle : content.title;
	const description =
		content.userDescription !== undefined ? content.userDescription : content.description;

	return Ok({
		type: 'basic',
		url: content.url,
		title: title != null && title.length > 0 ? title : undefined,
		description: description != null && description.length > 0 ? description : undefined,
		thumbnail: thumbnail != null ? resolveAsset(thumbnail, cx.node.site) : undefined
	});
}
