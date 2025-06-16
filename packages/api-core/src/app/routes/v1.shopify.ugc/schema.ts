import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	JsonSuccessResponse
} from '@repo/hono-utils';

const SFileDto = z
	.object({
		filename: z.string().min(1).openapi({ example: 'product-image.jpg' }),
		mimeType: z.string().min(1).openapi({ example: 'image/jpeg' }),
		fileSize: z.number().int().positive().openapi({ example: 1024000 }),
		contentType: z.enum(['IMAGE', 'VIDEO', 'FILE']).openapi({ example: 'IMAGE' })
	})
	.openapi('FileDto');

const SCreateFilesRequestDto = z
	.object({
		files: z.array(SFileDto).min(1)
	})
	.openapi('CreateFilesRequestDto');
export type TCreateFilesRequestDto = z.infer<typeof SCreateFilesRequestDto>;

const SUploadParameterDto = z
	.object({
		name: z.string().openapi({ example: 'key' }),
		value: z.string().openapi({ example: 'tmp/ugc/abc123/image.jpg' })
	})
	.openapi('UploadParameterDto');

const SStagedUploadTargetDto = z
	.object({
		url: z
			.string()
			.url()
			.openapi({ example: 'https://shopify-staged-uploads.storage.googleapis.com/' }),
		resourceUrl: z
			.string()
			.url()
			.nullable()
			.openapi({ example: 'https://cdn.shopify.com/s/files/1/0123/4567/files/image.jpg' }),
		parameters: z.array(SUploadParameterDto)
	})
	.openapi('StagedUploadTargetDto');

const SCreateFilesResponseDto = z
	.object({
		files: z.array(
			z.object({
				uploadTarget: SStagedUploadTargetDto,
				uploadId: z.string().openapi({ example: 'ugc_abc123def456' }),
				expiresAt: z.string().datetime().openapi({ example: '2024-01-15T10:30:00Z' })
			})
		)
	})
	.openapi('CreateFilesResponseDto');
export type TCreateFilesResponseDto = z.infer<typeof SCreateFilesResponseDto>;

export const CreateFilesRoute = createRoute({
	method: 'post',
	path: '/v1/shopify/ugc/files',
	tags: ['shopify', 'ugc'],
	summary: 'Create staged upload targets for files',
	description: 'Generate signed upload URLs for multiple user-generated content files',
	operationId: 'createUgcFiles',
	request: {
		body: {
			content: {
				'application/json': {
					schema: SCreateFilesRequestDto
				}
			}
		}
	},
	responses: {
		201: JsonSuccessResponse(SCreateFilesResponseDto),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});

const SSubmitFilesRequestDto = z
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
	.openapi('SubmitFilesRequestDto');
export type TSubmitFilesRequestDto = z.infer<typeof SSubmitFilesRequestDto>;

const SSubmitFileSuccessDto = z
	.object({
		status: z.literal('SUCCESS'),
		id: z.string().openapi({
			example: 'gid://shopify/MediaImage/12345678'
		}),
		uploadId: z.string().openapi({
			example: 'ugc_abc123def456'
		})
	})
	.openapi('SubmitFileSuccessDto');
export type TSubmitFileSuccessDto = z.infer<typeof SSubmitFileSuccessDto>;

const SSubmitFileErrorDto = z
	.object({
		status: z.literal('ERROR'),
		error: z.string().openapi({
			example: 'Failed to process file'
		}),
		uploadId: z.string().openapi({
			example: 'ugc_abc123def456'
		})
	})
	.openapi('SubmitFileErrorDto');
export type TSubmitFileErrorDto = z.infer<typeof SSubmitFileErrorDto>;

const SSubmitFilesResponseDto = z
	.object({
		files: z.array(z.discriminatedUnion('status', [SSubmitFileSuccessDto, SSubmitFileErrorDto]))
	})
	.openapi('SubmitFilesResponseDto');
export type TSubmitFilesResponseDto = z.infer<typeof SSubmitFilesResponseDto>;

export const SubmitFilesRoute = createRoute({
	method: 'post',
	path: '/v1/shopify/ugc/files/submit',
	tags: ['shopify', 'ugc'],
	summary: 'Submit uploaded files to Shopify media library',
	description: 'Process uploaded files and add them to the Shopify media library',
	operationId: 'submitUgcFiles',
	request: {
		body: {
			content: {
				'application/json': {
					schema: SSubmitFilesRequestDto
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(SSubmitFilesResponseDto),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});
