import { createRoute, z } from '@hono/zod-openapi';
import { BadRequestResponse, JsonSuccessResponse, NotFoundResponse } from '@repo/hono-utils';
import { SSiteContentDto, SSiteDto, SSiteSummaryDto } from '../v1.site/schema';

export const GetShopifySitesRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/site',
	tags: ['shopify', 'site'],
	summary: 'List connected sites',
	description: 'Returns all sites that are connected to the authenticated Shopify shop.',
	operationId: 'listShopifySites',
	responses: {
		200: JsonSuccessResponse(z.array(SSiteSummaryDto))
	}
});

export const UpdateShopifySiteContentRoute = createRoute({
	method: 'put',
	path: '/v1/shopify/site/{siteId}/content',
	tags: ['shopify', 'site'],
	summary: 'Update site content',
	description: 'Updates the content of a site connected to the authenticated Shopify shop.',
	operationId: 'updateShopifySiteContent',
	request: {
		params: z.object({
			siteId: z.string().uuid().openapi({
				example: '123e4567-e89b-12d3',
				description: 'Site ID'
			})
		}),
		body: {
			content: {
				'application/json': {
					schema: z.object({
						content: SSiteContentDto
					})
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(SSiteDto),
		400: BadRequestResponse,
		404: NotFoundResponse
	}
});

export const GetSiteContentByShopAndHandleRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/site/shop/{shop}/{handle}/content',
	tags: ['shopify', 'site'],
	summary: 'Get site content by shop and handle',
	operationId: 'getShopifySiteContentByShopAndHandle',
	request: {
		params: z.object({
			shop: z.string().openapi({
				example: 'my-shop.myshopify.com',
				description: 'Shop domain'
			}),
			handle: z.string().openapi({
				example: 'bio',
				description: 'Site handle/slug'
			})
		})
	},
	responses: {
		200: JsonSuccessResponse(SSiteContentDto),
		404: NotFoundResponse
	}
});
