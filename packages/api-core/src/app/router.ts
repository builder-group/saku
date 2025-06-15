import { OpenAPIHono } from '@hono/zod-openapi';
import { validationHook } from '@repo/hono-utils';

export const router = new OpenAPIHono({ defaultHook: validationHook });
