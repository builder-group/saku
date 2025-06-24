import { createRoute, z } from '@hono/zod-openapi';
import { InternalServerErrorResponse, JsonSuccessResponse } from '@repo/hono-utils';

export const GetInfoRoute = createRoute({
	method: 'get',
	path: '/v1/info',
	tags: ['info'],
	summary: 'Get API info',
	description: 'Returns the current info of the API',
	operationId: 'getInfo',
	responses: {
		200: JsonSuccessResponse(
			z.object({
				version: z.string().openapi({ example: 'v1.0.0d' }),
				url: z.string().openapi({ example: 'https://api.saku.so' }),
				appUrl: z.string().openapi({ example: 'https://app.saku.so' }),
				env: z.string().openapi({ example: 'production' })
			})
		),
		500: InternalServerErrorResponse
	}
});
