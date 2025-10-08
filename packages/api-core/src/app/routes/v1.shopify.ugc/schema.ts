import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	JsonSuccessResponse
} from '@repo/hono-utils';

export const CreateUploadTargetsRoute = createRoute({
	method: 'post',
	path: '/v1/shopify/ugc/files',
	tags: ['shopify', 'ugc'],
	summary: 'Create upload targets for files',
	operationId: 'createUgcUploadTargets',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
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
				}
			}
		}
	},
	responses: {
		201: JsonSuccessResponse(
			z.object({
				files: z.array(
					z.object({
						uploadTarget: z.object({
							url: z
								.url()
								.openapi({ example: 'https://shopify-staged-uploads.storage.googleapis.com/' }),
							resourceUrl: z.url().openapi({
								example: 'https://cdn.shopify.com/s/files/1/0123/4567/files/image.jpg'
							}),
							parameters: z.array(
								z.object({
									name: z.string().openapi({ example: 'key' }),
									value: z.string().openapi({ example: 'tmp/ugc/abc123/image.jpg' })
								})
							)
						}),
						uploadId: z.string().openapi({ example: 'ugc_abc123def456' }),
						expiresAt: z.iso.datetime().openapi({ example: '2024-01-15T10:30:00Z' })
					})
				)
			})
		),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});

export const SubmitUploadedFilesRoute = createRoute({
	method: 'post',
	path: '/v1/shopify/ugc/files/submit',
	tags: ['shopify', 'ugc'],
	summary: 'Submit uploaded files to media library',
	operationId: 'submitUgcUploadedFiles',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						files: z
							.array(
								z.object({
									uploadId: z.string().openapi({ example: 'ugc_abc123def456' }),
									resourceUrl: z.url().openapi({
										example: 'https://cdn.shopify.com/s/files/1/0123/4567/files/product-1.jpg'
									}),
									filename: z.string().min(1).openapi({ example: 'product-1.jpg' }),
									contentType: z.enum(['IMAGE', 'VIDEO', 'FILE']).openapi({ example: 'IMAGE' })
								})
							)
							.min(1)
					})
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				files: z.array(
					z.object({
						id: z.string().openapi({
							example: 'gid://shopify/MediaImage/12345678'
						}),
						uploadId: z.string().openapi({
							example: 'ugc_abc123def456'
						})
					})
				)
			})
		),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});

export const ListMediaFilesRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/ugc/files',
	tags: ['shopify', 'ugc'],
	summary: 'List files from media library',
	operationId: 'listUgcMediaFiles',
	request: {
		query: z.object({
			first: z.coerce.number().int().min(1).max(250).optional().openapi({
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
			reverse: z.coerce.boolean().optional().openapi({
				example: false,
				description: 'Reverse the sort order (true for descending, false for ascending)'
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
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				files: z.array(
					z
						.object({
							id: z.string().openapi({ example: 'gid://shopify/MediaImage/12345678' }),
							alt: z.string().openapi({ example: 'Product lifestyle image' }),
							createdAt: z.iso.datetime().openapi({ example: '2024-01-15T10:30:00Z' }),
							previewImage: z
								.object({
									id: z.string(),
									url: z.url()
								})
								.optional(),
							url: z.url(),
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
						.openapi('MediaFileDto')
				),
				pageInfo: z.object({
					hasNextPage: z.boolean(),
					endCursor: z.string().optional()
				})
			})
		),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});
