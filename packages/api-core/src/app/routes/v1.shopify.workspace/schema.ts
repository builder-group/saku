import { createRoute, z } from '@hono/zod-openapi';
import { JsonSuccessResponse, NotFoundResponse } from '@repo/hono-utils';

export const GetShopifyWorkspaceRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/workspace',
	tags: ['shopify', 'workspace'],
	summary: 'Get workspace info',
	description:
		'Returns workspace information for the authenticated Shopify shop, including onboarding status.',
	operationId: 'getShopifyWorkspace',
	responses: {
		200: JsonSuccessResponse(
			z
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
				.openapi('WorkspaceDto')
		),
		404: NotFoundResponse
	}
});
