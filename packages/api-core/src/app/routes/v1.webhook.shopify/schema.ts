import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	captureRawBodyMiddleware,
	JsonSuccessResponse,
	UnauthorizedResponse
} from '@repo/hono-utils';

export const CustomersDataRequestWebhookRoute = createRoute({
	method: 'post',
	path: '/v1/webhook/shopify/customers/data_request',
	tags: ['webhooks', 'shopify', 'privacy'],
	summary: 'Customer data request webhook',
	operationId: 'handleCustomerDataRequest',
	middleware: [captureRawBodyMiddleware] as const,
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
							email: z.email().openapi({ example: 'john@example.com' }),
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
	operationId: 'handleCustomerRedact',
	middleware: [captureRawBodyMiddleware] as const,
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						shop_id: z.number().int().openapi({ example: 954889 }),
						shop_domain: z.string().openapi({ example: 'my-shop.myshopify.com' }),
						customer: z.object({
							id: z.number().int().openapi({ example: 191167 }),
							email: z.email().openapi({ example: 'john@example.com' }),
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
	operationId: 'handleShopRedact',
	middleware: [captureRawBodyMiddleware] as const,
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

export const AppUninstalledWebhookRoute = createRoute({
	method: 'post',
	path: '/v1/webhook/shopify/app/uninstalled',
	tags: ['webhooks', 'shopify', 'app'],
	summary: 'App uninstalled webhook',
	operationId: 'handleAppUninstalled',
	middleware: [captureRawBodyMiddleware] as const,
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						id: z.number().int().openapi({ example: 548380009 }),
						name: z.string().openapi({ example: 'Super Toys' }),
						email: z.email().openapi({ example: 'super@supertoys.com' }),
						domain: z.string().nullable().openapi({ example: 'supertoys.com' }),
						myshopify_domain: z.string().openapi({ example: 'super-toys.myshopify.com' }),
						plan_name: z.string().openapi({ example: 'enterprise' }),
						plan_display_name: z.string().openapi({ example: 'Shopify Plus' }),
						country_code: z.string().openapi({ example: 'US' }),
						currency: z.string().openapi({ example: 'USD' }),
						timezone: z.string().openapi({ example: '(GMT-05:00) Eastern Time (US & Canada)' })
					})
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				message: z.string().openapi({ example: 'App uninstalled webhook received and processed' })
			})
		),
		400: BadRequestResponse,
		401: UnauthorizedResponse
	}
});

export const AppScopesUpdateWebhookRoute = createRoute({
	method: 'post',
	path: '/v1/webhook/shopify/app/scopes_update',
	tags: ['webhooks', 'shopify', 'app'],
	summary: 'App scopes update webhook',
	operationId: 'handleAppScopesUpdate',
	middleware: [captureRawBodyMiddleware] as const,
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						id: z.number().int().openapi({ example: 548380009 }),
						previous: z.array(z.string()).openapi({ example: ['read_products'] }),
						current: z.array(z.string()).openapi({ example: ['read_products', 'write_products'] }),
						updated_at: z.iso.datetime().openapi({ example: '2024-06-25T00:00:00.000Z' })
					})
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				message: z.string().openapi({ example: 'App scopes update webhook received and processed' })
			})
		),
		400: BadRequestResponse,
		401: UnauthorizedResponse
	}
});
