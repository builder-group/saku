import { createApiFetchClient } from 'feature-fetch';
import { appConfig } from './environment';
import { withOxylabs } from './lib';

export const fetchClient = createApiFetchClient();

export const proxiedFetchClient = createApiFetchClient({
	requestMiddlewares: [
		withOxylabs({
			username: appConfig.username,
			password: appConfig.password,
			debug: true
		})
	]
});
