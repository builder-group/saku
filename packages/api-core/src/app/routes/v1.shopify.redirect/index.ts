import { router } from '@/app/router';
import { getShopifyShopAccessToken, verifyShopifySession } from '@/lib';
import { checkUrlRedirectAvailability } from '@/lib/shopify';
import { CheckUrlRedirectAvailabilityRoute } from './schema';

router.openapi(CheckUrlRedirectAvailabilityRoute, async (c) => {
	const { shopId } = await verifyShopifySession(c);
	const { path } = c.req.valid('query');

	const accessToken = await getShopifyShopAccessToken(shopId);

	const availability = (
		await checkUrlRedirectAvailability(path as `/${string}`, {
			shopId,
			accessToken
		})
	).unwrap();

	return c.json(
		{
			isAvailable: availability.isAvailable,
			conflictType: availability.conflictType,
			conflictReason: availability.conflictReason,
			existingRedirects: availability.existingRedirects,
			reservedPaths: availability.reservedPaths
		},
		200
	);
});
