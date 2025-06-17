import { getShopifyShopAccessToken, listFiles } from '@/lib';
import type { TListMediaFilesQueryDto, TListMediaFilesResponseDto } from '../schema';

export async function listMediaFiles(
	shopId: string,
	input: TListMediaFilesQueryDto
): Promise<TListMediaFilesResponseDto> {
	const accessToken = await getShopifyShopAccessToken(shopId);

	const result = (
		await listFiles(shopId, accessToken, {
			first: input.first,
			after: input.after,
			query:
				input.fileTypes != null || input.fileName != null
					? {
							fileTypes: input.fileTypes,
							fileName: input.fileName
						}
					: undefined,
			sortKey: input.sortKey,
			reverse: input.reverse
		})
	).unwrap();

	return {
		files: result.files,
		pageInfo: result.pageInfo
	};
}
