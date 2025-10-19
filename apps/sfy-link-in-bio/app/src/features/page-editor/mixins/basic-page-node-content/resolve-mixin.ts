import { TBasicPageNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '../../../../lib';
import { TMixinResolveContext } from '../../lib';
import { TResolvedBasicPageNodeContentMixin } from './types';

export function resolveBasicPageNodeContentMixin(
	content: TBasicPageNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedBasicPageNodeContentMixin['value'], AppError> {
	return Ok(content);
}
