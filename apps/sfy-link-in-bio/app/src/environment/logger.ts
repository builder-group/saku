import { createLogger, LOG_LEVEL, withPrefix } from 'feature-logger';

export const logger = withPrefix(
	createLogger({
		// @ts-expect-error -- Needs to match "process.env.*" to be resolved during build time
		level: process.env.NODE_ENV === 'development' ? LOG_LEVEL.TRACE : LOG_LEVEL.INFO
	}),
	'[@repo/sfy-link-in-bio-app]'
);
