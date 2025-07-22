import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	JsonSuccessResponse,
	NotFoundResponse
} from '@repo/hono-utils';

export const GetShopOverviewRoute = createRoute({
	method: 'get',
	path: '/v1/shopify/shop/overview',
	tags: ['shopify', 'shop'],
	summary: 'Get shop overview including theme, social links, and recommended products',
	operationId: 'getShopOverview',
	responses: {
		200: JsonSuccessResponse(
			z
				.object({
					shop: z.object({
						id: z.string().openapi({ example: 'gid://shopify/Shop/123456789' }),
						name: z.string().openapi({ example: 'My Awesome Store' }),
						domain: z.string().openapi({ example: 'my-awesome-store.myshopify.com' }),
						description: z
							.string()
							.optional()
							.openapi({ example: 'Premium products for everyone' }),
						currency: z.string().openapi({ example: 'USD' }),
						country: z.string().optional().openapi({ example: 'US' }),
						email: z.string().openapi({ example: 'contact@my-awesome-store.com' }),
						contactEmail: z.string().openapi({ example: 'support@my-awesome-store.com' }),
						timezone: z.string().openapi({ example: 'America/New_York' }),
						primaryDomain: z
							.object({
								host: z.string().openapi({ example: 'my-awesome-store.com' }),
								url: z.string().url().openapi({ example: 'https://my-awesome-store.com' })
							})
							.optional()
							.openapi({ description: 'Primary custom domain if configured' })
					}),
					theme: z.object({
						id: z.string().openapi({ example: 'gid://shopify/Theme/123456789' }),
						name: z.string().openapi({ example: 'Dawn' }),
						role: z.string().openapi({ example: 'MAIN' }),
						logo: z.url().optional().openapi({
							example: 'https://cdn.shopify.com/logo.png',
							description: 'Shop logo URL'
						}),
						colors: z.object({
							primary: z
								.string()
								.optional()
								.openapi({ example: '#121212', description: 'Primary brand color' }),
							secondary: z
								.string()
								.optional()
								.openapi({ example: '#666666', description: 'Secondary brand color' }),
							background: z
								.string()
								.optional()
								.openapi({ example: '#ffffff', description: 'Background color' }),
							text: z
								.string()
								.optional()
								.openapi({ example: '#121212', description: 'Text color' }),
							button: z
								.string()
								.optional()
								.openapi({ example: '#121212', description: 'Button color' }),
							buttonText: z
								.string()
								.optional()
								.openapi({ example: '#ffffff', description: 'Button text color' })
						}),
						typography: z.object({
							headingFont: z
								.object({
									family: z.string().optional(),
									weight: z.number().optional(),
									style: z.string().optional()
								})
								.optional()
								.openapi({ example: 'Assistant', description: 'Heading font family' }),
							bodyFont: z
								.object({
									family: z.string().optional(),
									weight: z.number().optional(),
									style: z.string().optional()
								})
								.optional()
								.openapi({ example: 'Assistant', description: 'Body font family' })
						}),
						layout: z.object({
							pageWidth: z
								.number()
								.optional()
								.openapi({ example: 1200, description: 'Maximum page width in pixels' }),
							spacing: z
								.number()
								.optional()
								.openapi({ example: 0, description: 'Section spacing in pixels' }),
							borderRadius: z
								.number()
								.optional()
								.openapi({ example: 0, description: 'Border radius in pixels' })
						})
					}),
					socialLinks: z.array(
						z.object({
							platform: z
								.string()
								.openapi({ example: 'instagram', description: 'Social media platform' }),
							url: z.string().url().openapi({ example: 'https://instagram.com/shopname' }),
							username: z.string().optional().openapi({ example: '@shopname' })
						})
					),
					recommendedProducts: z.array(
						z.object({
							id: z.string().openapi({ example: 'gid://shopify/Product/123456789' }),
							title: z.string().openapi({ example: 'Premium T-Shirt' }),
							images: z
								.array(
									z.object({
										url: z.string().url().openapi({ example: 'https://cdn.shopify.com/image.jpg' }),
										altText: z
											.string()
											.optional()
											.openapi({ example: 'Premium T-Shirt product image' })
									})
								)
								.openapi({ description: 'Product images' }),
							options: z
								.array(
									z.object({
										name: z.string().openapi({ example: 'Size' }),
										values: z.array(z.string()).openapi({ example: ['S', 'M', 'L'] })
									})
								)
								.openapi({ description: 'Product options like size, color, etc.' }),
							variants: z
								.array(
									z.object({
										id: z.string().openapi({ example: 'gid://shopify/ProductVariant/123456789' }),
										title: z.string().openapi({ example: 'Small / Red' }),
										price: z.object({
											amount: z.string().openapi({ example: '29.99' }),
											currencyCode: z.string().openapi({ example: 'USD' })
										}),
										image: z
											.object({
												url: z
													.string()
													.url()
													.openapi({ example: 'https://cdn.shopify.com/variant-image.jpg' }),
												altText: z.string().optional().openapi({ example: 'Small Red T-Shirt' })
											})
											.optional()
											.openapi({ description: 'Variant-specific image' }),
										selectedOptions: z
											.array(
												z.object({
													name: z.string().openapi({ example: 'Size' }),
													value: z.string().openapi({ example: 'Small' })
												})
											)
											.openapi({ description: 'Selected options for this variant' })
									})
								)
								.openapi({ description: 'Product variants with pricing' })
						})
					)
				})
				.openapi('ShopOverviewDto')
		),
		400: BadRequestResponse,
		404: NotFoundResponse,
		500: InternalServerErrorResponse
	}
});
