import { createRoute, z } from '@hono/zod-openapi';
import { InternalServerErrorResponse, JsonSuccessResponse } from '@repo/hono-utils';

const SInfoDto = z
	.object({
		version: z.string().openapi({ example: 'v1.0.0d' }),
		url: z.string().openapi({ example: 'https://api.saku.so' }),
		env: z.string().openapi({ example: 'production' })
	})
	.openapi('InfoDto');
export type TInfoDto = z.infer<typeof SInfoDto>;

export const GetInfoRoute = createRoute({
	method: 'get',
	path: '/v1/info',
	tags: ['info'],
	summary: 'Get API info',
	description: 'Returns the current info of the API',
	operationId: 'getInfo',
	responses: {
		200: JsonSuccessResponse(SInfoDto),
		500: InternalServerErrorResponse
	}
});
