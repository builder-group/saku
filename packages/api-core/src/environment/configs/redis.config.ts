import * as v from 'valibot';
import { validateEnvVar } from 'validatenv';
import { vValidator } from 'validation-adapters/valibot';
import { appConfig } from './app.config';

const CACHE_PREFIX = `saku:${appConfig.env}`;

export const redisConfig = {
	url: validateEnvVar({
		envKey: 'REDIS_URL',
		validator: vValidator(v.string())
	}),
	token: validateEnvVar({
		envKey: 'REDIS_TOKEN',
		validator: vValidator(v.string())
	}),
	cached: {
		shopifySession: {
			keys: {
				byId: (sessionId: string) => `${CACHE_PREFIX}:shopify:session:${sessionId}`,
				byShop: (shopId: string) => `${CACHE_PREFIX}:shopify:sessions:shop:${shopId}`
			},
			ttl: 4 * 60 * 60
		}
	}
};
