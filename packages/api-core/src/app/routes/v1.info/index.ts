import { router } from '@/app/router';
import { appConfig } from '@/environment';
import { GetInfoRoute } from './schema';

router.openapi(GetInfoRoute, (c) => {
	return c.json(
		{
			version: appConfig.version,
			url: appConfig.url,
			env: appConfig.env
		},
		200
	);
});
