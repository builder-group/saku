import { createApiFetchClient } from 'feature-fetch';
import { appConfig } from '../configs';
import { withOxylabs } from './with-oxylabs';

export const fetchClient = createApiFetchClient();

export const oxyLabsFetchClient = withOxylabs(createApiFetchClient(), {
	username: appConfig.oxyLabs.username,
	password: appConfig.oxyLabs.password,
	endpoint: appConfig.oxyLabs.endpoint,
	debug: true
});

export const xFetchClient = createApiFetchClient({
	prefixUrl: appConfig.x.apiEndpoint,
	headers: {
		Authorization: `Bearer ${appConfig.x.bearerToken}`
	}
});
