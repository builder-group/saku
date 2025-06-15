import { createRoute, z } from '@hono/zod-openapi';
import { InternalServerErrorResponse, JsonSuccessResponse } from '@repo/hono-utils';

const SHealthDto = z
	.object({
		status: z.enum(['Up', 'Down']).openapi({ example: 'Up' }),
		message: z.string().openapi({ example: 'App is up and running' }),
		version: z.string().openapi({ example: 'v1.0.0d' })
	})
	.openapi('HealthDto');
export type THealthDto = z.infer<typeof SHealthDto>;

export const CheckHealthRoute = createRoute({
	method: 'get',
	path: '/v1/health',
	tags: ['health'],
	summary: 'Check API health',
	description: 'Returns the current health status of the API',
	operationId: 'checkHealth',
	responses: {
		200: JsonSuccessResponse(SHealthDto),
		500: InternalServerErrorResponse
	}
});
