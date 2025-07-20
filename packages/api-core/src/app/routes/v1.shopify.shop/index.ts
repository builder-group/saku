import { AppError } from '@repo/hono-utils';
import { router } from '@/app/router';
import { getShopifyOfflineAccessToken, getShopInfo, verifyShopifySession } from '@/lib';
import { getMainTheme, getParsedThemeSettingsData } from '@/lib/shopify';
import { extractThemeDataFromSettings } from '@/lib/shopify/theme/extract-theme-data';
import { GetShopOverviewRoute } from './schema';

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
	const themeSettings = themeSettingsResult.value;

	// Extract theme data from settings
	const extractedThemeData = extractThemeDataFromSettings(themeSettings.settingsData);

	// TODO: Get best selling products from Shopify API
	const bestSellingProducts: Array<{
		id: string;
		title: string;
		handle: string;
		featuredImage?: string;
		price: string;
		priceRange?: { min: string; max: string };
	}> = [];

	// TODO: Get shop stats from Shopify API
	const stats = {
		totalProducts: 0, // TODO: Get from Shopify API
		totalCollections: 0, // TODO: Get from Shopify API
		totalOrders: undefined // TODO: Get from Shopify API
	};

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
				primaryDomain: shopInfo.primaryDomain
			},
			theme: {
				id: theme.id,
				name: theme.name,
				role: theme.role,
				colors: extractedThemeData.colors,
				typography: extractedThemeData.typography,
				layout: extractedThemeData.layout
			},
			socialLinks: extractedThemeData.socialLinks,
			bestSellingProducts,
			stats
		},
		200
	);
});
