import { createRoute, z } from '@hono/zod-openapi';
import { BadRequestResponse, InternalServerErrorResponse, JsonSuccessResponse } from '@/openapi';

export const GetGoogleOAuthLoginRoute = createRoute({
	method: 'get',
	path: '/google/login',
	tags: ['auth'],
	summary: 'Initiate Google OAuth Login',
	description: 'Start the OAuth flow by redirecting to the Google authentication page',
	operationId: 'googleOAuthLogin',
	request: {
		query: z.object({
			callbackUrl: z.url().openapi({
				example: 'https://example.com/callback',
				description: 'The URL to redirect back to after authentication'
			})
		})
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				url: z.string()
			})
		),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});

export const PostGoogleOAuthLogoutRoute = createRoute({
	method: 'post',
	path: '/google/logout',
	tags: ['auth'],
	summary: 'End Google Session',
	description: 'End the current Google session',
	operationId: 'googleOAuthLogout',
	responses: {
		200: JsonSuccessResponse(
			z.object({
				success: z.boolean()
			})
		),
		500: InternalServerErrorResponse
	}
});

export const GetGoogleOAuthCallbackRoute = createRoute({
	method: 'get',
	path: '/google/callback',
	tags: ['auth'],
	summary: 'Handle Google OAuth Callback',
	description: 'Handle the OAuth callback and redirect back to the frontend with the session',
	operationId: 'googleOAuthCallback',
	request: {
		query: z.object({
			code: z.string().openapi({
				description: 'The authorization code from Google'
			}),
			state: z.string().openapi({
				description: 'The state parameter for security verification'
			})
		})
	},
	responses: {
		302: {
			description: 'Redirect to frontend application',
			headers: {
				Location: {
					description: 'The frontend URL to redirect to with the session information'
				}
			}
		},
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});
