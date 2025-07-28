import { createApp } from '@repo/api-core';
import { Hono } from 'hono';
import { apiConfig } from '@/.server/environment';
import { createApiProxy } from '@/.server/lib';
import { appConfig } from '@/environment';

/**
 * Server-only API handler.
 *
 * In development: Proxies to localhost API Core server
 * In production: Uses embedded API Core package
 */

export const app: Hono | { request: (request: Request) => Promise<Response> } =
	appConfig.env === 'development'
		? { request: createApiProxy({ targetUrl: apiConfig.core.url, stripPrefix: '/api' }) }
		: createApp(new Hono().basePath('/api'));
