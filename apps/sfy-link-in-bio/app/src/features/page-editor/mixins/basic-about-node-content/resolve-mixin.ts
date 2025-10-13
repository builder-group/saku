import { TBasicAboutNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TMixinResolveContext } from '../../lib';
import { TResolvedBasicAboutNodeContentMixin } from './types';

export function resolveBasicAboutNodeContentMixin(
	content: TBasicAboutNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedBasicAboutNodeContentMixin['value'], AppError> {
	return Ok({
		...content,
		avatar: content.avatar != null ? resolveAsset(content.avatar, cx.node.site) : undefined
	});
}
