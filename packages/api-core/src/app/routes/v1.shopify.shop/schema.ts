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
	summary: 'Get shop overview including theme, social links, and best-selling products',
	description:
		'Retrieves comprehensive shop overview including theme styling, social media links, and best-selling products for creating default templates',
	operationId: 'getShopOverview',
	responses: {
		200: JsonSuccessResponse(
			z.object({
				shop: z.object({
					id: z.string().openapi({ example: 'gid://shopify/Shop/123456789' }),
					name: z.string().openapi({ example: 'My Awesome Store' }),
					domain: z.string().openapi({ example: 'my-awesome-store.myshopify.com' }),
					description: z.string().optional().openapi({ example: 'Premium products for everyone' }),
					logo: z.url().optional().openapi({ example: 'https://cdn.shopify.com/logo.png' }),
					currency: z.string().openapi({ example: 'USD' }),
					country: z.string().openapi({ example: 'US' }),
					language: z.string().openapi({ example: 'EN' })
				}),
				theme: z.object({
					id: z.string().openapi({ example: 'gid://shopify/Theme/123456789' }),
					name: z.string().openapi({ example: 'Dawn' }),
					role: z.string().openapi({ example: 'MAIN' }),
					colors: z.object({
						primary: z.string().openapi({ example: '#121212', description: 'Primary brand color' }),
						secondary: z
							.string()
							.openapi({ example: '#666666', description: 'Secondary brand color' }),
						background: z.string().openapi({ example: '#ffffff', description: 'Background color' }),
						text: z.string().openapi({ example: '#121212', description: 'Text color' }),
						button: z.string().openapi({ example: '#121212', description: 'Button color' }),
						buttonText: z.string().openapi({ example: '#ffffff', description: 'Button text color' })
					}),
					typography: z.object({
						headingFont: z
							.string()
							.openapi({ example: 'Assistant', description: 'Heading font family' }),
						bodyFont: z.string().openapi({ example: 'Assistant', description: 'Body font family' }),
						headingScale: z
							.number()
							.openapi({ example: 100, description: 'Heading font scale percentage' }),
						bodyScale: z
							.number()
							.openapi({ example: 100, description: 'Body font scale percentage' })
					}),
					layout: z.object({
						pageWidth: z
							.number()
							.openapi({ example: 1200, description: 'Maximum page width in pixels' }),
						spacing: z.number().openapi({ example: 0, description: 'Section spacing in pixels' }),
						borderRadius: z.number().openapi({ example: 0, description: 'Border radius in pixels' })
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
				bestSellingProducts: z.array(
					z.object({
						id: z.string().openapi({ example: 'gid://shopify/Product/123456789' }),
						title: z.string().openapi({ example: 'Premium T-Shirt' }),
						handle: z.string().openapi({ example: 'premium-t-shirt' }),
						featuredImage: z
							.url()
							.optional()
							.openapi({ example: 'https://cdn.shopify.com/image.jpg' }),
						price: z.string().openapi({ example: '$29.99' }),
						priceRange: z
							.object({
								min: z.string().openapi({ example: '$29.99' }),
								max: z.string().openapi({ example: '$39.99' })
							})
							.optional()
					})
				),
				stats: z.object({
					totalProducts: z
						.number()
						.openapi({ example: 150, description: 'Total number of products' }),
					totalCollections: z
						.number()
						.openapi({ example: 12, description: 'Total number of collections' }),
					totalOrders: z
						.number()
						.optional()
						.openapi({ example: 1250, description: 'Total number of orders' })
				})
			})
		),
		400: BadRequestResponse,
		404: NotFoundResponse,
		500: InternalServerErrorResponse
	}
});
