import { TBasicLinkNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TMixinResolveContext } from '../../lib';
import { TResolvedBasicLinkNodeContentMixin } from './types';

export function resolveBasicLinkNodeContentMixin(
	content: TBasicLinkNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedBasicLinkNodeContentMixin['value'], AppError> {
	const contentImage = content.userImage !== undefined ? content.userImage : content.image;
	const resolvedContent: TResolvedBasicLinkNodeContentMixin['value'] = {
		type: 'basic',
		url: content.url,
		title: content.userTitle ?? content.title,
		description: content.userDescription ?? content.description,
		image: contentImage != null ? resolveAsset(contentImage, cx.node.site) : undefined
	};

	return Ok(resolvedContent);
}
