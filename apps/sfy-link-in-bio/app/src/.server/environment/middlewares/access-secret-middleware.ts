import { createHmacMiddleware } from '@/.server/lib';
import { apiConfig } from '../configs';

export const accessSecretMiddleware = createHmacMiddleware({
	secret: apiConfig.core.accessSecret
});
