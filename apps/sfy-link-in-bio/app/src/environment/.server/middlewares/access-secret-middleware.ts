import { createHmacMiddleware } from '@/lib/.server';
import { apiConfig } from '../configs';

export const accessSecretMiddleware = createHmacMiddleware({
	secret: apiConfig.core.accessSecret
});
