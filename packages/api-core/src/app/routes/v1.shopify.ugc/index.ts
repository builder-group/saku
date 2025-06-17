import { router } from '@/app/router';
import { verifyShopifySession } from '@/lib';
import { createUploadTargets, listMediaFiles, submitUploadedFiles } from './lib';
import { CreateUploadTargetsRoute, ListMediaFilesRoute, SubmitUploadedFilesRoute } from './schema';

router.openapi(CreateUploadTargetsRoute, async (c) => {
	const input = c.req.valid('json');
	const { shopId } = await verifyShopifySession(c);
	const result = await createUploadTargets(shopId, input);
	return c.json(result, 201);
});

router.openapi(SubmitUploadedFilesRoute, async (c) => {
	const input = c.req.valid('json');
	const { shopId } = await verifyShopifySession(c);
	const result = await submitUploadedFiles(shopId, input);
	return c.json(result, 200);
});

router.openapi(ListMediaFilesRoute, async (c) => {
	const input = c.req.valid('query');
	const { shopId } = await verifyShopifySession(c);
	const result = await listMediaFiles(shopId, input);
	return c.json(result, 200);
});
