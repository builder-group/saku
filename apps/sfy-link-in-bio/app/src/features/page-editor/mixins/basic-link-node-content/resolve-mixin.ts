import { TBasicLinkNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TMixinResolveContext } from '../../lib';
import { TResolvedBasicLinkNodeContentMixin } from './types';

export function resolveBasicLinkNodeContentMixin(
	content: TBasicLinkNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedBasicLinkNodeContentMixin['value'], AppError> {
	const image = content.userImage !== undefined ? content.userImage : content.image;

	return Ok({
		type: 'basic',
		url: content.url,
		title: content.userTitle ?? content.title,
		description: content.userDescription ?? content.description,
		image: image != null ? resolveAsset(image, cx.node.site) : undefined
	});
}
