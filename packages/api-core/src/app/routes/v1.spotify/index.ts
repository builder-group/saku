import { router } from '@/app/router';
import { verifyAccessSecret, verifyShopifySession } from '@/lib';
import { getSpotifyTheme } from './lib';
import { GetSpotifyThemeRoute } from './schema';

router.openapi(GetSpotifyThemeRoute, async (c) => {
	const shopifySessionResult = await verifyShopifySession(c);
	if (shopifySessionResult.isErr()) {
		(await verifyAccessSecret(c)).unwrap();
	}

	const { url } = c.req.valid('query');

	const theme = await getSpotifyTheme(url);

	return c.json(theme, 200);
});
