import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	JsonSuccessResponse
} from '@repo/hono-utils';

const SCreateUploadUrlDto = z
	.object({
		filename: z.string().min(1).openapi({ example: 'product-image.jpg' }),
		mimeType: z.string().min(1).openapi({ example: 'image/jpeg' }),
		fileSize: z.number().int().positive().openapi({ example: 1024000 }),
		contentType: z.enum(['IMAGE', 'VIDEO', 'FILE']).openapi({ example: 'IMAGE' })
	})
	.openapi('CreateUploadUrlDto');

export type TCreateUploadUrlRequestDto = z.infer<typeof SCreateUploadUrlDto>;

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
		parameters: z.array(SUploadParameterDto).openapi({
			example: [
				{ name: 'key', value: 'tmp/ugc/abc123/image.jpg' },
				{ name: 'Content-Type', value: 'image/jpeg' },
				{ name: 'acl', value: 'private' }
			]
		})
	})
	.openapi('StagedUploadTargetDto');

const SCreateUploadUrlResponseDto = z
	.object({
		uploadTarget: SStagedUploadTargetDto,
		uploadId: z.string().openapi({ example: 'ugc_abc123def456' }),
		expiresAt: z.string().datetime().openapi({ example: '2024-01-15T10:30:00Z' })
	})
	.openapi('CreateUploadUrlResponseDto');

export type TCreateUploadUrlResponseDto = z.infer<typeof SCreateUploadUrlResponseDto>;

export const CreateUploadUrlRoute = createRoute({
	method: 'post',
	path: '/v1/shopify/ugc/upload-url',
	tags: ['shopify', 'ugc'],
	summary: 'Create file upload URL',
	description: 'Generate a signed upload URL for user-generated content files',
	operationId: 'createUgcUploadUrl',
	request: {
		body: {
			content: {
				'application/json': {
					schema: SCreateUploadUrlDto
				}
			}
		}
	},
	responses: {
		201: JsonSuccessResponse(SCreateUploadUrlResponseDto),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});
