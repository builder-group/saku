import { TRichTextNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { TResolvedRichTextNodeContentMixin } from './types';

export function resolveRichTextNodeContentMixin(
	content: TRichTextNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedRichTextNodeContentMixin['value'], AppError> {
	return Ok(content);
}
