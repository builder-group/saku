import { createRoute, z } from '@hono/zod-openapi';
import { BadRequestResponse, JsonSuccessResponse, UnauthorizedResponse } from '@repo/hono-utils';

export const CustomersDataRequestWebhookRoute = createRoute({
	method: 'post',
	path: '/v1/webhook/shopify/customers/data_request',
	tags: ['webhooks', 'shopify', 'privacy'],
	summary: 'Customer data request webhook',
	description: 'Receives webhook when customers request their data from a store owner',
	operationId: 'handleCustomerDataRequest',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						shop_id: z.number().int().openapi({ example: 954889 }),
						shop_domain: z.string().openapi({ example: 'my-shop.myshopify.com' }),
						orders_requested: z
							.array(z.number().int())
							.openapi({ example: [299938, 280263, 220458] }),
						customer: z.object({
							id: z.number().int().openapi({ example: 191167 }),
							email: z.string().email().openapi({ example: 'john@example.com' }),
							phone: z.string().openapi({ example: '555-625-1199' })
						}),
						data_request: z.object({
							id: z.number().int().openapi({ example: 9999 })
						})
					})
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				message: z.string().openapi({ example: 'Data request webhook received and processed' })
			})
		),
		400: BadRequestResponse,
		401: UnauthorizedResponse
	}
});

export const CustomersRedactWebhookRoute = createRoute({
	method: 'post',
	path: '/v1/webhook/shopify/customers/redact',
	tags: ['webhooks', 'shopify', 'privacy'],
	summary: 'Customer data redaction webhook',
	description: 'Receives webhook when store owners request customer data deletion',
	operationId: 'handleCustomerRedact',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						shop_id: z.number().int().openapi({ example: 954889 }),
						shop_domain: z.string().openapi({ example: 'my-shop.myshopify.com' }),
						customer: z.object({
							id: z.number().int().openapi({ example: 191167 }),
							email: z.string().email().openapi({ example: 'john@example.com' }),
							phone: z.string().openapi({ example: '555-625-1199' })
						}),
						orders_to_redact: z
							.array(z.number().int())
							.openapi({ example: [299938, 280263, 220458] })
					})
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				message: z
					.string()
					.openapi({ example: 'Customer redaction webhook received and processed' })
			})
		),
		400: BadRequestResponse,
		401: UnauthorizedResponse
	}
});

export const ShopRedactWebhookRoute = createRoute({
	method: 'post',
	path: '/v1/webhook/shopify/shop/redact',
	tags: ['webhooks', 'shopify', 'privacy'],
	summary: 'Shop data redaction webhook',
	description: 'Receives webhook 48 hours after a store owner uninstalls the app',
	operationId: 'handleShopRedact',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						shop_id: z.number().int().openapi({ example: 954889 }),
						shop_domain: z.string().openapi({ example: 'my-shop.myshopify.com' })
					})
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				message: z.string().openapi({ example: 'Shop redaction webhook received and processed' })
			})
		),
		400: BadRequestResponse,
		401: UnauthorizedResponse
	}
});
