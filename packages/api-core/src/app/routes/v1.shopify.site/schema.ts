import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	ConflictResponse,
	JsonSuccessResponse,
	NotFoundResponse
} from '@repo/hono-utils';
import { SFlatSiteContentDto, SSiteDto, SSiteSummaryDto } from '../v1.site/schema';

export const GetShopifySitesRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/site',
	tags: ['shopify', 'site'],
	summary: 'List connected sites',
	operationId: 'listShopifySites',
	responses: {
		200: JsonSuccessResponse(z.array(SSiteSummaryDto))
	}
});

export const GetShopifySiteByShopAndHandleRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/site/shop/{shop}/{handle}',
	tags: ['shopify', 'site'],
	summary: 'Get site by shop and handle',
	operationId: 'getShopifySiteByShopAndHandle',
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
		200: JsonSuccessResponse(
			z.object({
				id: z.uuid(),
				content: SFlatSiteContentDto
			})
		),
		404: NotFoundResponse
	}
});

export const CreateShopifySiteRoute = createRoute({
	method: 'post',
	path: '/v1/shopify/site',
	tags: ['shopify', 'site'],
	summary: 'Create new site',
	operationId: 'createShopifySite',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						handle: z.string().openapi({
							example: 'bio',
							description: 'Site handle/slug'
						}),
						displayName: z.string().optional().openapi({
							example: 'My Bio Site',
							description: 'Human-friendly site name'
						}),
						content: SFlatSiteContentDto,
						createRedirect: z.coerce.boolean().optional().openapi({
							example: true,
							description: 'Whether to create a URL redirect for the site (defaults to true)'
						}),
						overrideRedirect: z.coerce.boolean().optional().openapi({
							example: false,
							description:
								'If true and createRedirect is true, will override any existing redirect with the same path'
						})
					})
				}
			}
		}
	},
	responses: {
		201: JsonSuccessResponse(SSiteDto),
		400: BadRequestResponse,
		404: NotFoundResponse
	}
});

export const UpdateShopifySiteRoute = createRoute({
	method: 'patch',
	path: '/v1/shopify/site/{siteId}',
	tags: ['shopify', 'site'],
	summary: 'Update site',
	operationId: 'updateShopifySite',
	request: {
		params: z.object({
			siteId: z.uuid().openapi({
				example: '123e4567-e89b-12d3',
				description: 'Site ID'
			})
		}),
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
							.min(1, 'Handle must be at least 1 character')
							.max(50, 'Handle must be at most 50 characters')
							.optional()
							.openapi({ example: 'bio', description: 'Site handle/slug' }),
						displayName: z
							.string()
							.max(32, 'Display name must be at most 32 characters')
							.optional()
							.openapi({ example: 'My Bio Site', description: 'Human-friendly site name' }),
						content: SFlatSiteContentDto.optional()
					})
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(SSiteDto),
		400: BadRequestResponse,
		404: NotFoundResponse,
		409: ConflictResponse
	}
});

export const DeleteShopifySiteRoute = createRoute({
	method: 'delete',
	path: '/v1/shopify/site/{siteId}',
	tags: ['shopify', 'site'],
	summary: 'Delete site',
	operationId: 'deleteShopifySite',
	request: {
		params: z.object({
			siteId: z.uuid().openapi({
				example: '123e4567-e89b-12d3',
				description: 'Site ID'
			})
		})
	},
	responses: {
		204: {
			description: 'Site deleted successfully'
		},
		400: BadRequestResponse,
		404: NotFoundResponse,
		409: ConflictResponse
	}
});

export const GetBlankPresetRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/site/preset/blank',
	tags: ['shopify', 'site'],
	summary: 'Get a blank site preset with shop data',
	operationId: 'getBlankPreset',
	description:
		'Returns a blank site preset populated with shop information including theme, social links, and recommended products',
	responses: {
		200: JsonSuccessResponse(
			z.object({
				id: z.string().openapi({ example: 'blank-preset', description: 'Preset identifier' }),
				label: z
					.string()
					.openapi({ example: 'Blank Preset', description: 'Human-readable preset name' }),
				content: SFlatSiteContentDto
			})
		),
		400: BadRequestResponse,
		404: NotFoundResponse
	}
});
