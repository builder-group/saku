import { AppError } from '@repo/hono-utils';
import { createFiles, getShopifyShopAccessToken } from '@/lib';
import type {
	TSubmitFileErrorDto,
	TSubmitFilesRequestDto,
	TSubmitFilesResponseDto,
	TSubmitFileSuccessDto
} from '../schema';

export async function submitFiles(
	shopId: string,
	input: TSubmitFilesRequestDto
): Promise<TSubmitFilesResponseDto> {
	const accessToken = await getShopifyShopAccessToken(shopId);

	// Create all files
	const result = await createFiles(
		shopId,
		accessToken,
		input.files.map((file) => ({
			alt: file.filename,
			contentType: mapContentTypeToResource(file.contentType),
			originalSource: file.resourceUrl
		}))
	);
	if (result.isErr()) {
		throw result.error;
	}

	// Map created files to response format
	const files: (TSubmitFileSuccessDto | TSubmitFileErrorDto)[] = input.files.map(
		(inputFile, index) => {
			const createdFile = result.value[index];
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
		}
	);

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
