import { createRoute, z } from '@hono/zod-openapi';
import { BadRequestResponse, JsonSuccessResponse } from '@repo/hono-utils';

export const CheckUrlRedirectAvailabilityRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/redirect/availability',
	tags: ['shopify', 'redirect'],
	summary: 'Check URL redirect path availability',
	description:
		'Checks if a URL path is available for creating a redirect by validating against reserved paths and existing redirects.',
	operationId: 'checkUrlRedirectAvailability',
	request: {
		query: z.object({
			path: z.string().startsWith('/').openapi({
				example: '/my-custom-path',
				description: 'The URL path to check (must start with /)'
			})
		})
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				isAvailable: z.boolean().openapi({
					example: true,
					description: 'Whether the URL path is available for redirect creation'
				}),
				conflictType: z.enum(['reserved_path', 'existing_redirect']).nullable().openapi({
					example: null,
					description: 'Type of conflict if path is not available'
				}),
				conflictReason: z.string().nullable().openapi({
					example: null,
					description: 'Human-readable explanation of why the path is not available'
				}),
				existingRedirects: z
					.array(
						z.object({
							id: z.string().openapi({
								example: 'gid://shopify/UrlRedirect/12345',
								description: 'Shopify redirect ID'
							}),
							path: z.string().openapi({
								example: '/my-custom-path',
								description: 'The redirect path'
							}),
							target: z.string().openapi({
								example: '/products/my-product',
								description: 'The redirect target'
							})
						})
					)
					.openapi({
						description: 'List of existing redirects that conflict with the requested path'
					}),
				reservedPaths: z.array(z.string()).openapi({
					example: ['/products', '/collections', '/pages'],
					description: 'List of Shopify reserved paths when conflict type is reserved_path'
				})
			})
		),
		400: BadRequestResponse
	}
});
