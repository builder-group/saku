import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';
import { appConfig } from './app.config';

const CACHE_PREFIX = appConfig.env === 'production' ? 'saku' : 'saku:local';

export const redisConfig = {
	url: validateEnvVar({
		envKey: 'REDIS_URL',
		validator: vValidator(v.string())
	}),
	token: validateEnvVar({
		envKey: 'REDIS_TOKEN',
		validator: vValidator(v.string())
	}),
	keys: {
		prefix: CACHE_PREFIX,
		shopify: {
			sessionById: (sessionId: string) => `${CACHE_PREFIX}:shopify:session:${sessionId}`,
			sessionsByShop: (shopId: string) => `${CACHE_PREFIX}:shopify:sessions:shop:${shopId}`
		}
	},
	ttlSeconds: 5
};
