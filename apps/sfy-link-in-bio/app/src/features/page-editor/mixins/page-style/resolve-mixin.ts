import { TAsset, TAssetHash, TPageStyleMixin } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveFillStyleMixin } from '../fill-style';
import { TResolvedPageStyleMixin } from './types';

export function resolvePageStyleMixin(
	page: TPageStyleMixin['value'],
	context: {
		getAsset: (hash: TAssetHash) => TAsset | null;
	}
): TResult<TResolvedPageStyleMixin['value'], AppError> {
	const [isFillOk, fillErr, fill] = resolveFillStyleMixin(page.fill, context);
	if (!isFillOk) {
		return Err(fillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}

	return Ok({
		layout: {
			spacing: page.layout.spacing,
			styles: {
				gap: `${page.layout.spacing}px`
			}
		},
		fill
	});
}
