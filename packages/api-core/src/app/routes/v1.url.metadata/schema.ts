import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	JsonSuccessResponse,
	NotFoundResponse
} from '@repo/hono-utils';

const SUrlMetadataDto = z
	.object({
		url: z.url().openapi({
			example: 'https://example.com',
			description: 'The URL that was fetched'
		}),

		// Content metadata
		title: z.string().optional().openapi({
			example: 'Example Page Title',
			description: 'The page title from meta tags or title tag'
		}),
		description: z.string().optional().openapi({
			example: 'A brief description of the page content',
			description: 'The page description from meta tags'
		}),
		site: z
			.object({
				name: z.string().optional().openapi({
					example: 'Example Site',
					description: 'The name of the website'
				}),
				video: z.url().optional().openapi({
					example: 'https://example.com/video',
					description: 'URL to the site-wide video if available'
				})
			})
			.optional(),

		// Media URLs
		media: z
			.object({
				image: z.url().optional().openapi({
					example: 'https://example.com/image.jpg',
					description: 'Primary image URL from og:image or similar tags'
				}),
				video: z.url().optional().openapi({
					example: 'https://example.com/video.mp4',
					description: 'Primary video URL from og:video or similar tags'
				}),
				audio: z.url().optional().openapi({
					example: 'https://example.com/audio.mp3',
					description: 'Primary audio URL if available'
				})
			})
			.optional(),

		// Icons
		icons: z
			.object({
				favicon: z.url().optional().openapi({
					example: 'https://example.com/favicon.ico',
					description: 'URL to the favicon'
				}),
				touch: z.url().optional().openapi({
					example: 'https://example.com/apple-touch-icon.png',
					description: 'URL to the touch icon (e.g. apple-touch-icon)'
				}),
				mask: z.url().optional().openapi({
					example: 'https://example.com/mask-icon.svg',
					description: 'URL to the mask icon (e.g. Safari pinned tab)'
				})
			})
			.optional()
	})
	.openapi('UrlMetadataDto');
export type TUrlMetadataDto = z.infer<typeof SUrlMetadataDto>;

export const GetUrlMetadataRoute = createRoute({
	method: 'get',
	path: '/v1/url/metadata',
	tags: ['url'],
	summary: 'Get metadata from URL',
	description:
		'Fetches and extracts metadata from the provided URL including title, description, media URLs and icons',
	operationId: 'getUrlMetadata',
	request: {
		query: z.object({
			url: z.url().openapi({
				example: 'https://example.com',
				description: 'The URL to fetch metadata from'
			})
		})
	},
	responses: {
		200: JsonSuccessResponse(SUrlMetadataDto),
		400: BadRequestResponse,
		404: NotFoundResponse,
		500: InternalServerErrorResponse
	}
});
