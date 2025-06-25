import { Err, Ok, type TResult } from '@blgc/utils';
import { coreApiV1 } from '@repo/types/api';
import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { coreApiClient } from '@/environment';
import type { TError } from '@/types';

export async function listMediaFiles(
	config: TListMediaFilesConfig
): Promise<TResult<TListMediaFilesSuccess, TError>> {
	const { shopify, ...queryParams } = config;
	const idToken = await shopify.idToken();

	const result = await coreApiClient.get('/v1/shopify/ugc/files', {
		queryParams,
		headers: {
			Authorization: `Bearer ${idToken}`
		}
	});
	if (result.isErr()) {
		return Err({
			code: '#ERR_LIST_MEDIA_FILES',
			message: `Failed to list media files: ${result.error.message}`
		});
	}

	const data = result.value.data;
	return Ok({
		files: data.files,
		pageInfo: {
			hasNextPage: data.pageInfo.hasNextPage,
			endCursor: data.pageInfo.endCursor
		}
	});
}

export type TListMediaFilesConfig = {
	shopify: ShopifyGlobal;
} & coreApiV1.paths['/v1/shopify/ugc/files']['get']['parameters']['query'];

export type TMediaFile = coreApiV1.components['schemas']['MediaFileDto'];

export interface TListMediaFilesSuccess {
	files: TMediaFile[];
	pageInfo: {
		hasNextPage: boolean;
		endCursor?: string;
	};
}
