import { AppError } from '@repo/hono-utils';
import { router } from '@/app/router';
import {
	cleanupShopData,
	getRecommendedProducts,
	getShopifyOfflineAccessToken,
	getShopInfo,
	getShopPlan,
	verifyShopifySession
} from '@/lib';
import { getShopPrimaryUrl } from '@/lib/gql/shopify-admin/queries/shop-primary-url';
import { getMainTheme, getParsedThemeSettingsData } from '@/lib/shopify';
import { extractThemeDataFromSettings } from '@/lib/shopify/theme/extract-theme-data';
import {
	GetShopOverviewRoute,
	GetShopPlanRoute,
	GetShopPrimaryUrlRoute,
	ResetShopSettingsRoute
} from './schema';

router.openapi(GetShopOverviewRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	// Get shop info
	const shopInfoResult = await getShopInfo({
		shopId,
		accessToken
	});
	if (shopInfoResult.isErr()) {
		throw new AppError('#ERR_SHOP_INFO_FETCH_FAILED', 500, {
			title: 'Failed to fetch shop info',
			detail: shopInfoResult.error.message
		});
	}
	const shopInfo = shopInfoResult.value;

	// Get main theme
	const mainThemeResult = await getMainTheme({
		shopId,
		accessToken
	});
	if (mainThemeResult.isErr()) {
		throw new AppError('#ERR_THEME_FETCH_FAILED', 500, {
			title: 'Failed to fetch theme',
			detail: mainThemeResult.error.message
		});
	}
	const theme = mainThemeResult.value;

	// Get main theme settings
	const themeSettingsResult = await getParsedThemeSettingsData(theme.id, {
		shopId,
		accessToken
	});
	if (themeSettingsResult.isErr()) {
		throw new AppError('#ERR_THEME_SETTINGS_FETCH_FAILED', 500, {
			title: 'Failed to fetch theme settings',
			detail: themeSettingsResult.error.message
		});
	}
	const themeSettings = await extractThemeDataFromSettings(themeSettingsResult.value.settingsData, {
		shopId,
		accessToken
	});

	// Get recommended products
	const recommendedProductsResult = await getRecommendedProducts(
		{ first: 3 },
		{
			shopId,
			accessToken
		}
	);
	if (recommendedProductsResult.isErr()) {
		throw new AppError('#ERR_RECOMMENDED_PRODUCTS_FETCH_FAILED', 500, {
			title: 'Failed to fetch recommended products',
			detail: recommendedProductsResult.error.message
		});
	}
	const recommendedProducts = recommendedProductsResult.value;

	return c.json(
		{
			shop: {
				id: shopInfo.id,
				name: shopInfo.name,
				domain: shopInfo.domain,
				description: shopInfo.description,
				currency: shopInfo.currency,
				country: shopInfo.country,
				email: shopInfo.email,
				contactEmail: shopInfo.contactEmail,
				timezone: shopInfo.timezone,
				primaryDomain: shopInfo.primaryDomain,
				plan: shopInfo.plan
			},
			theme: {
				id: theme.id,
				name: theme.name,
				role: theme.role,
				logo: themeSettings.logo,
				colors: themeSettings.colors,
				typography: themeSettings.typography,
				layout: themeSettings.layout
			},
			socialLinks: themeSettings.socialLinks,
			recommendedProducts: recommendedProducts.products
		},
		200
	);
});

router.openapi(GetShopPlanRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	// Get shop plan
	const [isShopPlanOk, shopPlanErr, shopPlan] = await getShopPlan({
		shopId,
		accessToken
	});
	if (!isShopPlanOk) {
		throw new AppError('#ERR_SHOP_PLAN_FETCH_FAILED', 500, {
			title: 'Failed to fetch shop plan',
			detail: shopPlanErr.message
		});
	}

	return c.json(
		{
			id: shopPlan.id,
			plan: shopPlan.plan
		},
		200
	);
});

router.openapi(GetShopPrimaryUrlRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	// Get shop primary URL
	const shopPrimaryUrlResult = await getShopPrimaryUrl({
		shopId,
		accessToken
	});
	if (shopPrimaryUrlResult.isErr()) {
		throw new AppError('#ERR_SHOP_PRIMARY_URL_FETCH_FAILED', 500, {
			title: 'Failed to fetch shop primary URL',
			detail: shopPrimaryUrlResult.error.message
		});
	}

	return c.json(
		{
			id: shopPrimaryUrlResult.value.id,
			primaryDomain: shopPrimaryUrlResult.value.primaryDomain
		},
		200
	);
});

router.openapi(ResetShopSettingsRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();

	await cleanupShopData(shopId);

	return c.json(
		{
			message: 'Shop settings reset successfully'
		},
		200
	);
});
