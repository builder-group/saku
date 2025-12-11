import {
	ResponseConfig,
	type ZodContentObject,
	type ZodMediaTypeObject,
	type ZodRequestBody
} from '@asteasolutions/zod-to-openapi';
import { z } from '@hono/zod-openapi';

/**
 * RFC 7807-compliant error schema with custom extension fields (`code`, `errors`).
 *
 * https://datatracker.ietf.org/doc/html/rfc7807
 * https://datatracker.ietf.org/doc/html/rfc9457
 * https://swagger.io/blog/problem-details-rfc9457-doing-api-errors-well/
 */
export const SAppErrorDto = z
	.object({
		type: z.string().default('about:blank').openapi({
			description: 'A URI reference that identifies the problem type.',
			example: 'https://docs.example.com/errors/validation-error'
		}),
		title: z.string().openapi({
			description: 'A short, human-readable summary of the problem type.',
			example: 'Validation failed for the request parameters.'
		}),
		status: z.number().int().openapi({
			description: 'The HTTP status code for this occurrence of the problem.',
			example: 400
		}),
		detail: z.string().optional().openapi({
			description: 'A human-readable explanation specific to this error occurrence.',
			example: 'Field `email` must be a valid email address.'
		}),
		instance: z.string().optional().openapi({
			description: 'A URI reference that identifies the specific occurrence of the problem.',
			example: '/api/users/1234'
		}),
		code: z.string().optional().openapi({
			description: 'An application-specific error code, useful for client-side logic.',
			example: 'VALIDATION_ERROR'
		}),
		errors: z
			.array(z.record(z.string(), z.unknown()))
			.optional()
			.openapi({
				description: 'Extension member for additional error context (e.g., per-field validation).',
				example: [
					{ field: 'email', reason: 'must be a valid email' },
					{ field: 'password', reason: 'is required' }
				]
			})
	})
	.openapi('AppErrorDto');

export type TAppErrorDto = z.infer<typeof SAppErrorDto>;

export function JsonRequestBody<GSchema extends ZodMediaTypeObject['schema']>(
	schema: GSchema
): TRequestBody<{ 'application/json': { schema: GSchema } }> {
	return {
		content: {
			'application/json': {
				schema
			}
		}
	};
}

export function JsonSuccessResponse<GSchema extends ZodMediaTypeObject['schema']>(
	schema: GSchema
): TResponseConfigWithContent<{
	'application/json': { schema: GSchema };
}> {
	return {
		description: 'Successful response',
		content: {
			'application/json': {
				schema
			}
		}
	};
}

export function SuccessResponse(description: string = 'Success response'): TResponseConfig {
	return {
		description
	};
}

export function ErrorResponse(description: string = 'Error response'): TResponseConfigWithContent<{
	'application/json': { schema: typeof SAppErrorDto };
}> {
	return {
		description,
		content: {
			'application/json': {
				schema: SAppErrorDto
			}
		}
	};
}

export const BadRequestResponse = ErrorResponse('Bad request');
export const UnauthorizedResponse = ErrorResponse('Unauthorized');
export const NotFoundResponse = ErrorResponse('Resource not found');
export const ConflictResponse = ErrorResponse('Conflict');
export const InternalServerErrorResponse = ErrorResponse('Internal server error');

export interface TResponseConfigWithContent<GContent extends ZodContentObject> extends Omit<
	ResponseConfig,
	'content'
> {
	content: GContent;
}
export type TResponseConfig = ResponseConfig;

export interface TRequestBody<GContent extends ZodContentObject> extends Omit<
	ZodRequestBody,
	'content'
> {
	content: GContent;
}
