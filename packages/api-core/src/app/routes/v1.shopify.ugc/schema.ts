import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	JsonSuccessResponse
} from '@repo/hono-utils';

// =========================================================================
// Create Upload Targets Route
// =========================================================================

const SCreateUploadTargetsRequestDto = z
	.object({
		files: z
			.array(
				z.object({
					filename: z.string().min(1).openapi({ example: 'product-image.jpg' }),
					mimeType: z.string().min(1).openapi({ example: 'image/jpeg' }),
					fileSize: z.number().int().positive().openapi({ example: 1024000 }),
					contentType: z.enum(['IMAGE', 'VIDEO', 'FILE']).openapi({ example: 'IMAGE' })
				})
			)
			.min(1)
	})
	.openapi('CreateUploadTargetsRequestDto');
export type TCreateUploadTargetsRequestDto = z.infer<typeof SCreateUploadTargetsRequestDto>;

const SCreateUploadTargetsResponseDto = z
	.object({
		files: z.array(
			z.object({
				uploadTarget: z.object({
					url: z
						.string()
						.url()
						.openapi({ example: 'https://shopify-staged-uploads.storage.googleapis.com/' }),
					resourceUrl: z
						.string()
						.url()
						.openapi({ example: 'https://cdn.shopify.com/s/files/1/0123/4567/files/image.jpg' }),
					parameters: z.array(
						z
							.object({
								name: z.string().openapi({ example: 'key' }),
								value: z.string().openapi({ example: 'tmp/ugc/abc123/image.jpg' })
							})
							.openapi('UploadParameterDto')
					)
				}),
				uploadId: z.string().openapi({ example: 'ugc_abc123def456' }),
				expiresAt: z.string().datetime().openapi({ example: '2024-01-15T10:30:00Z' })
			})
		)
	})
	.openapi('CreateUploadTargetsResponseDto');
export type TCreateUploadTargetsResponseDto = z.infer<typeof SCreateUploadTargetsResponseDto>;

export const CreateUploadTargetsRoute = createRoute({
	method: 'post',
	path: '/v1/shopify/ugc/files',
	tags: ['shopify', 'ugc'],
	summary: 'Create upload targets for files',
	description: 'Generate signed upload URLs for multiple user-generated content files',
	operationId: 'createUgcUploadTargets',
	request: {
		body: {
			content: {
				'application/json': {
					schema: SCreateUploadTargetsRequestDto
				}
			}
		}
	},
	responses: {
		201: JsonSuccessResponse(SCreateUploadTargetsResponseDto),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});

// =========================================================================
// Submit Uploaded Files Route
// =========================================================================

const SSubmitUploadedFilesRequestDto = z
	.object({
		files: z
			.array(
				z.object({
					uploadId: z.string().openapi({ example: 'ugc_abc123def456' }),
					resourceUrl: z.string().url().openapi({
						example: 'https://cdn.shopify.com/s/files/1/0123/4567/files/product-1.jpg'
					}),
					filename: z.string().min(1).openapi({ example: 'product-1.jpg' }),
					contentType: z.enum(['IMAGE', 'VIDEO', 'FILE']).openapi({ example: 'IMAGE' })
				})
			)
			.min(1)
	})
	.openapi('SubmitUploadedFilesRequestDto');
export type TSubmitUploadedFilesRequestDto = z.infer<typeof SSubmitUploadedFilesRequestDto>;

const SSubmitUploadedFileSuccessDto = z
	.object({
		status: z.literal('SUCCESS'),
		id: z.string().openapi({
			example: 'gid://shopify/MediaImage/12345678'
		}),
		uploadId: z.string().openapi({
			example: 'ugc_abc123def456'
		})
	})
	.openapi('SubmitUploadedFileSuccessDto');
export type TSubmitUploadedFileSuccessDto = z.infer<typeof SSubmitUploadedFileSuccessDto>;

const SSubmitUploadedFileErrorDto = z
	.object({
		status: z.literal('ERROR'),
		error: z.string().openapi({
			example: 'Failed to process file'
		}),
		uploadId: z.string().openapi({
			example: 'ugc_abc123def456'
		})
	})
	.openapi('SubmitUploadedFileErrorDto');
export type TSubmitUploadedFileErrorDto = z.infer<typeof SSubmitUploadedFileErrorDto>;

const SSubmitUploadedFilesResponseDto = z
	.object({
		files: z.array(
			z.discriminatedUnion('status', [SSubmitUploadedFileSuccessDto, SSubmitUploadedFileErrorDto])
		)
	})
	.openapi('SubmitUploadedFilesResponseDto');
export type TSubmitUploadedFilesResponseDto = z.infer<typeof SSubmitUploadedFilesResponseDto>;

export const SubmitUploadedFilesRoute = createRoute({
	method: 'post',
	path: '/v1/shopify/ugc/files/submit',
	tags: ['shopify', 'ugc'],
	summary: 'Submit uploaded files to media library',
	description: 'Process uploaded files and add them to the Shopify media library',
	operationId: 'submitUgcUploadedFiles',
	request: {
		body: {
			content: {
				'application/json': {
					schema: SSubmitUploadedFilesRequestDto
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(SSubmitUploadedFilesResponseDto),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});

// =========================================================================
// List Media Files Route
// =========================================================================

const SMediaFileDto = z
	.object({
		id: z.string().openapi({ example: 'gid://shopify/MediaImage/12345678' }),
		alt: z.string().openapi({ example: 'Product lifestyle image' }),
		createdAt: z.string().datetime().openapi({ example: '2024-01-15T10:30:00Z' }),
		previewImage: z
			.object({
				id: z.string(),
				url: z.string().url()
			})
			.optional(),
		url: z.string().url(),
		fileName: z.string().openapi({ example: 'product-1.jpg' }),
		details: z.discriminatedUnion('type', [
			z.object({
				type: z.literal('image'),
				id: z.string().optional(),
				width: z.number().optional(),
				height: z.number().optional()
			}),
			z.object({
				type: z.literal('video'),
				width: z.number(),
				height: z.number(),
				format: z.string()
			}),
			z.object({
				type: z.literal('file'),
				mimeType: z.string().optional()
			})
		])
	})
	.openapi('MediaFileDto');

const SListMediaFilesQueryParamsDto = z
	.object({
		first: z.number().int().min(1).max(250).optional().openapi({
			example: 20,
			description: 'Number of items to return (max 250)'
		}),
		after: z.string().optional().openapi({
			example: 'cursor_abc123',
			description: 'Cursor for pagination'
		}),
		sortKey: z
			.enum(['CREATED_AT', 'FILENAME', 'ID', 'ORIGINAL_UPLOAD_SIZE', 'RELEVANCE', 'UPDATED_AT'])
			.optional()
			.openapi({
				example: 'CREATED_AT',
				description: 'Field to sort results by'
			}),
		fileTypes: z
			.preprocess(
				(val) => {
					// Handle both single value and array of values
					if (typeof val === 'string') {
						return [val];
					}
					return val;
				},
				z.array(z.enum(['IMAGE', 'VIDEO', 'FILE', 'MODEL_3D', 'EXTERNAL_VIDEO']))
			)
			.optional()
			.openapi({
				example: ['IMAGE', 'VIDEO'],
				description: 'Filter by file types. Can be specified multiple times for multiple types.'
			}),
		fileName: z.string().optional().openapi({
			example: 'banner',
			description: 'Filter by filename'
		})
	})
	.openapi('ListMediaFilesQueryDto');
export type TListMediaFilesQueryDto = z.infer<typeof SListMediaFilesQueryParamsDto>;

const SListMediaFilesResponseDto = z
	.object({
		files: z.array(SMediaFileDto),
		pageInfo: z.object({
			hasNextPage: z.boolean(),
			endCursor: z.string().optional()
		})
	})
	.openapi('ListMediaFilesResponseDto');
export type TListMediaFilesResponseDto = z.infer<typeof SListMediaFilesResponseDto>;

export const ListMediaFilesRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/ugc/files',
	tags: ['shopify', 'ugc'],
	summary: 'List files from media library',
	description:
		'Retrieve a paginated list of files from the Shopify media library with optional filtering',
	operationId: 'listUgcMediaFiles',
	request: {
		query: SListMediaFilesQueryParamsDto
	},
	responses: {
		200: JsonSuccessResponse(SListMediaFilesResponseDto),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});
