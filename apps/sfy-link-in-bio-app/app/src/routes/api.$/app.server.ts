import { createApp } from '@repo/api-core';
import { Hono } from 'hono';

/**
 * Server-only Hono app instance.
 *
 * Created in a `.server.ts` file to ensure it is NEVER bundled for the client.
 */
export const app = createApp(new Hono().basePath('/api'));
