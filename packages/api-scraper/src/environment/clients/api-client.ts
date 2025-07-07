import { createApiFetchClient, withRetry } from 'feature-fetch';
import { appConfig } from '../configs';
import { withOxylabs } from './with-oxylabs';

export const fetchClient = createApiFetchClient();

export const oxyLabsFetchClient = withOxylabs(createApiFetchClient(), {
	username: appConfig.oxyLabs.username,
	password: appConfig.oxyLabs.password,
	endpoint: appConfig.oxyLabs.endpoint,
	debug: true
});

// X API has strict rate limits (3 requests / 15 mins) on the free tier
// Using withRetry to automatically handle rate limits by:
// 1. Detecting 429 Too Many Requests responses
// 2. Reading x-rate-limit-reset header to know when we can retry
// 3. Waiting for the rate limit window to reset
// 4. Automatically retrying the request (up to 3 times by default)
export const xFetchClient = withRetry(
	createApiFetchClient({
		prefixUrl: appConfig.x.apiEndpoint,
		headers: {
			Authorization: `Bearer ${appConfig.x.bearerToken}`
		}
	})
);
