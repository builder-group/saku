import { AppError } from '@repo/hono-utils';
import {
	createStagedUploads,
	getShopifyShopAccessToken,
	type TStagedMediaUploadTarget
} from '@/lib';
import type { TCreateFilesRequestDto, TCreateFilesResponseDto } from '../schema';

export async function createFiles(
	shopId: string,
	input: TCreateFilesRequestDto
): Promise<TCreateFilesResponseDto> {
	const accessToken = await getShopifyShopAccessToken(shopId);

	// Create all staged uploads
	const result = await createStagedUploads(
		shopId,
		accessToken,
		input.files.map((file) => ({
			filename: file.filename,
			mimeType: file.mimeType,
			resource: mapContentTypeToResource(file.contentType),
			fileSize: file.fileSize.toString()
		}))
	);
	if (result.isErr()) {
		throw result.error;
	}

	// Map the results to response format
	const files = result.value.map((target: TStagedMediaUploadTarget) => ({
		uploadTarget: {
			url: target.url,
			resourceUrl: target.resourceUrl,
			parameters: target.parameters
		},
		uploadId: `ugc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
	}));

	return { files };
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
