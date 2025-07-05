import { createApiFetchClient } from 'feature-fetch';
import { appConfig } from '../configs';
import { withOxylabs } from './with-oxylabs';

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
