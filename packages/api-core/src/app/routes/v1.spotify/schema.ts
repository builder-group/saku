import { createRoute, z } from '@hono/zod-openapi';
import {
	BadRequestResponse,
	InternalServerErrorResponse,
	JsonSuccessResponse,
	NotFoundResponse
} from '@repo/hono-utils';

const SRgba = z
	.object({
		r: z.number().min(0).max(1).openapi({
			example: 0.157,
			description: 'Red component (0-1)'
		}),
		g: z.number().min(0).max(1).openapi({
			example: 0.282,
			description: 'Green component (0-1)'
		}),
		b: z.number().min(0).max(1).openapi({
			example: 0.659,
			description: 'Blue component (0-1)'
		}),
		a: z.number().min(0).max(1).openapi({
			example: 1,
			description: 'Alpha/opacity component (0-1)'
		})
	})
	.openapi('Rgba');
export type TRgba = z.infer<typeof SRgba>;

const SSpotifyThemeDto = z
	.object({
		url: z.url().openapi({
			example: 'https://open.spotify.com/embed/artist/0TnOYISbd1XYRBk9myaseg',
			description: 'The Spotify embed URL that was processed'
		}),
		theme: z
			.record(z.string(), z.union([z.string(), z.number(), SRgba]))
			.optional()
			.openapi({
				description: 'Dynamic theme properties extracted from CSS custom properties'
			})
	})
	.openapi('SpotifyThemeDto');
export type TSpotifyThemeDto = z.infer<typeof SSpotifyThemeDto>;

export const GetSpotifyThemeRoute = createRoute({
	method: 'get',
	path: '/v1/spotify/theme',
	tags: ['spotify'],
	summary: 'Get theme from Spotify embed URL',
	operationId: 'getSpotifyTheme',
	request: {
		query: z.object({
			url: z.url().openapi({
				example: 'https://open.spotify.com/embed/artist/0TnOYISbd1XYRBk9myaseg',
				description: 'The Spotify embed URL to extract theme from'
			})
		})
	},
	responses: {
		200: JsonSuccessResponse(SSpotifyThemeDto),
		400: BadRequestResponse,
		404: NotFoundResponse,
		500: InternalServerErrorResponse
	}
});
