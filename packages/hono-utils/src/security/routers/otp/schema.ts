import { createRoute, z } from '@hono/zod-openapi';
import { BadRequestResponse, InternalServerErrorResponse, JsonSuccessResponse } from '@/openapi';

export const PostOtpLoginRoute = createRoute({
	method: 'post',
	path: '/otp/login',
	tags: ['auth'],
	summary: 'Request OTP Login',
	description: 'Send a one-time password to the provided identifier',
	operationId: 'otpAuthLogin',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						identifier: z.string().min(1).openapi({
							example: 'user@example.com',
							description: 'Identifier to send OTP to (email, phone, etc)'
						}),
						callbackUrl: z.url().openapi({
							example: 'https://example.com/dashboard',
							description: 'URL to redirect to after verification'
						})
					})
				}
			}
		}
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				success: z.boolean()
			})
		),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});

export const PostOtpLogoutRoute = createRoute({
	method: 'post',
	path: '/otp/logout',
	tags: ['auth'],
	summary: 'End OTP Session',
	description: 'End the current OTP session',
	operationId: 'otpAuthLogout',
	responses: {
		200: JsonSuccessResponse(
			z.object({
				success: z.boolean()
			})
		),
		500: InternalServerErrorResponse
	}
});

export const GetOtpCallbackRoute = createRoute({
	method: 'get',
	path: '/otp/callback',
	tags: ['auth'],
	summary: 'Verify OTP with Callback',
	description: 'Verify the provided one-time password and redirect to callback URL',
	operationId: 'otpAuthCallback',
	request: {
		query: z.object({
			identifier: z.string().min(1).openapi({
				example: 'user@example.com',
				description: 'Identifier to verify'
			}),
			otp: z.string().length(6).openapi({
				example: 'ab12cd',
				description: 'The 6-character one-time password'
			}),
			callbackUrl: z.url().openapi({
				example: 'https://example.com/dashboard',
				description: 'URL to redirect to after verification'
			})
		})
	},
	responses: {
		302: {
			description: 'Redirect to callback URL',
			headers: {
				Location: {
					description: 'The callback URL to redirect to'
				}
			}
		},
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});

export const GetOtpVerifyRoute = createRoute({
	method: 'get',
	path: '/otp/verify',
	tags: ['auth'],
	summary: 'Verify OTP',
	description: 'Verify the provided one-time password and return success status',
	operationId: 'otpAuthVerify',
	request: {
		query: z.object({
			identifier: z.string().min(1).openapi({
				example: 'user@example.com',
				description: 'Identifier to verify'
			}),
			otp: z.string().length(6).openapi({
				example: 'ab12cd',
				description: 'The 6-character one-time password'
			})
		})
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				success: z.boolean()
			})
		),
		400: BadRequestResponse,
		500: InternalServerErrorResponse
	}
});
