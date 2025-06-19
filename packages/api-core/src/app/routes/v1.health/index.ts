import { router } from '@/app/router';
import { appConfig } from '@/environment';
import { CheckHealthRoute } from './schema';

router.openapi(CheckHealthRoute, (c) => {
	return c.json(
		{
			message: 'App is up and running',
			status: 'Up',
			version: appConfig.version
		} as const,
		200
	);
});
