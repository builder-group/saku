import { AppError } from '@repo/hono-utils';
import { pika } from '@/environment';
import { createStagedUploads, getShopifyShopAccessToken } from '@/lib';
import { TCreateUploadTargetsRequestDto, TCreateUploadTargetsResponseDto } from '../schema';

export async function createUploadTargets(
	shopId: string,
	input: TCreateUploadTargetsRequestDto
): Promise<TCreateUploadTargetsResponseDto> {
	const accessToken = await getShopifyShopAccessToken(shopId);

	const createdTargets = (
		await createStagedUploads(
			shopId,
			accessToken,
			input.files.map((file) => ({
				filename: file.filename,
				mimeType: file.mimeType,
				resource: mapContentTypeToResource(file.contentType),
				fileSize: file.fileSize.toString()
			}))
		)
	).unwrap();

	return {
		files: createdTargets.map((target) => ({
			uploadTarget: {
				url: target.url,
				resourceUrl: target.resourceUrl,
				parameters: target.parameters
			},
			uploadId: pika.gen('ugc'),
			expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
		}))
	};
}

function mapContentTypeToResource(contentType: string): 'IMAGE' | 'VIDEO' | 'FILE' {
	switch (contentType) {
		case 'IMAGE':
			return 'IMAGE';
		case 'VIDEO':
			return 'VIDEO';
		case 'FILE':
			return 'FILE';
		default:
			throw new AppError('#ERR_INVALID_CONTENT_TYPE', 400, {
				detail: `Unsupported content type: ${contentType}`
			});
	}
}
