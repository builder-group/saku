import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	ConflictResponse,
	JsonSuccessResponse,
	NotFoundResponse
} from '@repo/hono-utils';

const WorkspaceDto = z
	.object({
		id: z.uuid().openapi({ example: '123e4567-e89b-12d3' }),
		handle: z.string().openapi({ example: 'my-store.myshopify.com' }),
		displayName: z.string().optional().openapi({ example: 'My Store' }),
		image: z.string().optional().openapi({ example: 'https://cdn.shopify.com/logo.png' }),
		onboardingCompletedAt: z.iso.datetime().nullable().openapi({
			example: '2024-03-20T00:00:00Z',
			description: 'When onboarding was completed. null if onboarding is needed.'
		}),
		createdAt: z.iso.datetime().openapi({ example: '2024-03-20T00:00:00Z' }),
		updatedAt: z.iso.datetime().openapi({ example: '2024-03-20T00:00:00Z' })
	})
	.openapi('WorkspaceDto');

export const GetShopifyWorkspaceRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/workspace',
	tags: ['shopify', 'workspace'],
	summary: 'Get workspace info',
	operationId: 'getShopifyWorkspace',
	responses: {
		200: JsonSuccessResponse(WorkspaceDto),
		404: NotFoundResponse
	}
});

export const UpdateShopifyWorkspaceRoute = createRoute({
	method: 'patch',
	path: '/v1/shopify/workspace',
	tags: ['shopify', 'workspace'],
	summary: 'Update workspace info',
	operationId: 'updateShopifyWorkspace',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						handle: z
							.string()
							.regex(
								/^[a-z0-9-]+$/,
								'Handle must only contain lowercase letters, numbers, and dashes'
							)
							.min(3, 'Handle must be at least 3 characters')
							.max(50, 'Handle must be at most 50 characters')
							.optional()
							.openapi({ example: 'my-awesome-store' }),
						displayName: z
							.string()
							.max(32, 'Display name must be at most 32 characters')
							.optional()
							.openapi({ example: 'My Awesome Store' }),
						image: z.url().optional().openapi({ example: 'https://cdn.shopify.com/logo.png' })
					})
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(WorkspaceDto),
		400: BadRequestResponse,
		404: NotFoundResponse,
		409: ConflictResponse
	}
});
