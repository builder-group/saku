import { AppError } from '@repo/hono-utils';
import { createShopifyFile, createStagedUpload, getShopifyShopAccessToken } from '@/lib';
import type { TCreateUploadUrlRequestDto, TCreateUploadUrlResponseDto } from '../schema';

export async function createUploadUrl(
	shopId: string,
	input: TCreateUploadUrlRequestDto
): Promise<TCreateUploadUrlResponseDto> {
	const accessToken = await getShopifyShopAccessToken(shopId);

	const target = await createStagedUpload(shopId, accessToken, {
		filename: input.filename,
		mimeType: input.mimeType,
		resource: mapContentTypeToResource(input.contentType),
		fileSize: input.fileSize
	});

	const uploadId = `ugc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

	// Create file in Shopify's media library
	await createShopifyFile(shopId, accessToken, {
		alt: input.filename,
		contentType: mapContentTypeToResource(input.contentType),
		originalSource: target.resourceUrl!
	});

	return {
		uploadTarget: {
			url: target.url!,
			resourceUrl: target.resourceUrl!,
			parameters: target.parameters
		},
		uploadId,
		expiresAt
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
