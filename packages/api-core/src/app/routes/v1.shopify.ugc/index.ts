import { router } from '@/app/router';
import { verifyShopifySession } from '@/lib';
import { createFiles, submitFiles } from './lib';
import { CreateFilesRoute, SubmitFilesRoute } from './schema';

router.openapi(CreateFilesRoute, async (c) => {
	const input = c.req.valid('json');
	const { shopId } = await verifyShopifySession(c);
	const result = await createFiles(shopId, input);
	return c.json(result, 201);
});

router.openapi(SubmitFilesRoute, async (c) => {
	const input = c.req.valid('json');
	const { shopId } = await verifyShopifySession(c);
	const result = await submitFiles(shopId, input);
	return c.json(result, 200);
});
