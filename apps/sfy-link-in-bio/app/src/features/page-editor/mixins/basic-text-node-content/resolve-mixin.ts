import { TBasicTextNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { TMixinResolveContext } from '../../lib';
import { TResolvedBasicTextNodeContentMixin } from './types';

export function resolveBasicTextNodeContentMixin(
	content: TBasicTextNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedBasicTextNodeContentMixin['value'], AppError> {
	return Ok(content);
}
