import { router } from '@/app/router';
import { appConfig } from '@/environment';
import { CheckHealthRoute, THealthDto } from './schema';

router.openapi(CheckHealthRoute, (c) => {
	return c.json(
		{
			message: 'App is up and running',
			status: 'Up',
			version: appConfig.version
		} satisfies THealthDto,
		200
	);
});
