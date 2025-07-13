import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	JsonSuccessResponse,
	NotFoundResponse
} from '@repo/hono-utils';

const SShopifySessionDto = z
	.object({
		id: z.string().openapi({ example: 'my-shop.myshopify.com_987654321' }),
		shop: z.string().openapi({ example: 'my-shop.myshopify.com' }),
		state: z.string().openapi({ example: '' }),
		isOnline: z.boolean().openapi({ example: true }),
		scope: z.string().openapi({ example: 'write_products,read_customers' }),
		expires: z.iso.datetime().nullable().openapi({ example: '2025-06-14T13:39:33.336Z' }),
		accessToken: z.string().openapi({ example: 'shpat_def456...uvw012' }),
		onlineAccessInfo: z
			.object({
				expires_in: z.number().optional().openapi({ example: 86399 }),
				associated_user_scope: z
					.string()
					.optional()
					.openapi({ example: 'write_products,read_customers' }),
				session: z.string().optional().openapi({ example: 'session_token_hash_string' }),
				account_number: z.number().nullable().optional().openapi({ example: null }),
				associated_user: z.object({
					id: z.number().openapi({ example: 987654321 }),
					first_name: z.string().openapi({ example: 'John' }),
					last_name: z.string().openapi({ example: 'Doe' }),
					email: z.email().openapi({ example: 'john@example.com' }),
					account_owner: z.boolean().openapi({ example: true }),
					locale: z.string().openapi({ example: 'en-US' }),
					collaborator: z.boolean().openapi({ example: false }),
					email_verified: z.boolean().openapi({ example: true })
				})
			})
			.nullable()
	})
	.openapi('ShopifySessionDto');
export type TShopifySessionDto = z.infer<typeof SShopifySessionDto>;

export const CreateSessionRoute = createRoute({
	method: 'post',
	path: '/v1/auth/shopify/session',
	tags: ['auth', 'shopify'],
	summary: 'Create Shopify session',
	description: 'Store a new Shopify session from app installation or authentication',
	operationId: 'createShopifySession',
	request: {
		body: {
			content: {
				'application/json': {
					schema: SShopifySessionDto
				}
			}
		}
	},
	responses: {
		204: {
			description: 'Session created successfully'
		},
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});

export const GetSessionRoute = createRoute({
	method: 'get',
	path: '/v1/auth/shopify/session/{sessionId}',
	tags: ['auth', 'shopify'],
	summary: 'Get Shopify session by ID',
	description: 'Retrieve a specific Shopify session by its ID',
	operationId: 'getShopifySession',
	request: {
		params: z.object({
			sessionId: z.string().openapi({ example: 'my-shop.myshopify.com_987654321' })
		})
	},
	responses: {
		200: JsonSuccessResponse(SShopifySessionDto),
		404: NotFoundResponse,
		500: InternalServerErrorResponse
	}
});

export const DeleteSessionRoute = createRoute({
	method: 'delete',
	path: '/v1/auth/shopify/session/{sessionId}',
	tags: ['auth', 'shopify'],
	summary: 'Delete Shopify session',
	description: 'Remove a Shopify session by its ID',
	operationId: 'deleteShopifySession',
	request: {
		params: z.object({
			sessionId: z.string().openapi({ example: 'my-shop.myshopify.com_987654321' })
		})
	},
	responses: {
		204: {
			description: 'Session deleted successfully'
		},
		404: NotFoundResponse,
		500: InternalServerErrorResponse
	}
});

export const GetSessionByShopRoute = createRoute({
	method: 'get',
	path: '/v1/auth/shopify/session/shop/{shopId}',
	tags: ['auth', 'shopify'],
	summary: 'Get Shopify session by shop',
	description: 'Retrieve Shopify sessions for a specific shop domain',
	operationId: 'getShopifySessionByShop',
	request: {
		params: z.object({
			shopId: z.string().openapi({ example: 'my-shop.myshopify.com' })
		})
	},
	responses: {
		200: JsonSuccessResponse(z.array(SShopifySessionDto)),
		404: NotFoundResponse,
		500: InternalServerErrorResponse
	}
});
