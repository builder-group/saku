import { AppError } from '@repo/hono-utils';
import { createFiles, getShopifyShopAccessToken } from '@/lib';
import { TSubmitUploadedFilesRequestDto, TSubmitUploadedFilesResponseDto } from '../schema';

export async function submitUploadedFiles(
	shopId: string,
	input: TSubmitUploadedFilesRequestDto
): Promise<TSubmitUploadedFilesResponseDto> {
	const accessToken = await getShopifyShopAccessToken(shopId);

	const createdFiles = (
		await createFiles(
			shopId,
			accessToken,
			input.files.map((file) => ({
				filename: file.filename,
				alt: file.filename,
				contentType: mapContentTypeToResource(file.contentType),
				originalSource: file.resourceUrl
			}))
		)
	).unwrap();

	if (createdFiles.length !== input.files.length) {
		throw new AppError('#ERR_INVALID_RESPONSE', 500, {
			detail: 'Invalid response from Shopify'
		});
	}

	return {
		files: input.files.map((inputFile, index) => {
			const createdFile = createdFiles[index];
			if (createdFile == null) {
				return {
					uploadId: inputFile.uploadId,
					status: 'ERROR',
					error: 'File creation failed'
				};
			}

			return {
				id: createdFile.id,
				uploadId: inputFile.uploadId,
				status: 'SUCCESS'
			};
		})
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
