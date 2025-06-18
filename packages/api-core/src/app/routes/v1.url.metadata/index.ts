import { router } from '@/app/router';
import { verifyShopifySession } from '@/lib';
import { getMetadata, getPredefinedFavicon } from './lib';
import { GetUrlMetadataRoute } from './schema';

router.openapi(GetUrlMetadataRoute, async (c) => {
	const { url } = c.req.valid('query');
	await verifyShopifySession(c);

	const metadata = await getMetadata(url);

	// Apply predefined favicon if available
	const predefinedFavicon = getPredefinedFavicon(url);
	if (predefinedFavicon != null) {
		if (metadata.icons == null) {
			metadata.icons = {};
		}
		metadata.icons.favicon = predefinedFavicon;
	}

	return c.json(metadata, 200);
});
