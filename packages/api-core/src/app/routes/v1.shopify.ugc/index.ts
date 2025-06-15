import { router } from '@/app/router';
import { verifyShopifySession } from '@/lib';
import { createUploadUrl } from './lib';
import { CreateUploadUrlRoute } from './schema';

// UGC upload URL generation route
router.openapi(CreateUploadUrlRoute, async (c) => {
	const input = c.req.valid('json');
	const { shopId } = await verifyShopifySession(c);
	const result = await createUploadUrl(shopId, input);
	return c.json(result, 201);
});
