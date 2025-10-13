import { TSingleMediaNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TMixinResolveContext } from '../../lib';
import { TResolvedSingleMediaNodeContentMixin } from './types';

export function resolveSingleMediaNodeContentMixin(
	content: TSingleMediaNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedSingleMediaNodeContentMixin['value'], AppError> {
	let resolvedMedia: TResolvedSingleMediaNodeContentMixin['value']['media'] | undefined;
	if (content.media != null) {
		const resolvedAsset = resolveAsset(content.media?.hash, cx.node.site);
		if (resolvedAsset != null) {
			resolvedMedia = {
				...content.media,
				src: resolvedAsset.src
			};
		}
	}

	return Ok({
		...content,
		media: resolvedMedia
	});
}
