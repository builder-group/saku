import { createRoute, z } from '@hono/zod-openapi';
import { BadRequestResponse, InternalServerErrorResponse, JsonSuccessResponse } from '@/openapi';

export const GetGithubOAuthLoginRoute = createRoute({
	method: 'get',
	path: '/github/login',
	tags: ['auth'],
	summary: 'Initiate GitHub OAuth Login',
	description: 'Start the OAuth flow by redirecting to the GitHub authentication page',
	operationId: 'githubOAuthLogin',
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

export const PostGithubOAuthLogoutRoute = createRoute({
	method: 'post',
	path: '/github/logout',
	tags: ['auth'],
	summary: 'End GitHub Session',
	description: 'End the current GitHub session',
	operationId: 'githubOAuthLogout',
	responses: {
		200: JsonSuccessResponse(
			z.object({
				success: z.boolean()
			})
		),
		500: InternalServerErrorResponse
	}
});

export const GetGithubOAuthCallbackRoute = createRoute({
	method: 'get',
	path: '/github/callback',
	tags: ['auth'],
	summary: 'Handle GitHub OAuth Callback',
	description: 'Handle the OAuth callback and redirect back to the frontend with the session',
	operationId: 'githubOAuthCallback',
	request: {
		query: z.object({
			code: z.string().openapi({
				description: 'The authorization code from GitHub'
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
