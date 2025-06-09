import { createLogger, LOG_LEVEL, withPrefix } from 'feature-logger';
import { appConfig } from './configs';

export const logger = withPrefix(
	createLogger({
		level: appConfig.env === 'development' ? LOG_LEVEL.TRACE : LOG_LEVEL.INFO
	}),
	'[@repo/sfy-link-in-bio-app]'
);
