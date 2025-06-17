import { getShopifyShopAccessToken, listFiles } from '@/lib';
import type { TListMediaFilesQueryDto, TListMediaFilesResponseDto } from '../schema';

export async function listMediaFiles(
	shopId: string,
	input: TListMediaFilesQueryDto
): Promise<TListMediaFilesResponseDto> {
	const accessToken = await getShopifyShopAccessToken(shopId);

	// Convert query params to structured query if fileTypes or filename is provided
	const query =
		input.fileTypes || input.filename
			? {
					fileTypes: input.fileTypes,
					filename: input.filename
				}
			: undefined;

	const result = (
		await listFiles(shopId, accessToken, {
			first: input.first,
			after: input.after,
			query,
			sortKey: input.sortKey
		})
	).unwrap();

	return {
		files: result.files,
		pageInfo: result.pageInfo
	};
}
