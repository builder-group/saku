import { type coreApiV1 } from '@repo/types/api';
import { createOpenApiFetchClient } from 'feature-fetch';
import { apiClientConfig } from '../configs';

export const coreApiClient = createOpenApiFetchClient<coreApiV1.paths>({
	prefixUrl: apiClientConfig.core.url
});
