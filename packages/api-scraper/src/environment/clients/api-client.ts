import { createApiFetchClient } from 'feature-fetch';
import { appConfig } from '../configs';
import { withOxylabs } from './with-oxylabs';

export const fetchClient = withOxylabs(createApiFetchClient(), {
	username: appConfig.username,
	password: appConfig.password,
	debug: true
});
