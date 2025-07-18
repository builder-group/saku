import { AppError } from '@repo/hono-utils';
import { router } from '@/app/router';
import { getShopifyOfflineAccessToken, verifyShopifySession } from '@/lib';
import { getMainTheme } from '@/lib/shopify';
import { GetShopOverviewRoute } from './schema';

router.openapi(GetShopOverviewRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

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

	// TODO: Extract social links from theme settings or scrape storefront
	const socialLinks: Array<{ platform: string; url: string; username?: string }> = [];

	// TODO: Get best selling products from Shopify API
	const bestSellingProducts: Array<{
		id: string;
		title: string;
		handle: string;
		featuredImage?: string;
		price: string;
		priceRange?: { min: string; max: string };
	}> = [];

	// TODO: Get shop info from Shopify API
	const shopInfo = {
		id: 'gid://shopify/Shop/placeholder', // TODO: Get from Shopify API
		name: 'Shop Name', // TODO: Get from Shopify API
		domain: shopId,
		description: undefined, // TODO: Get from Shopify API
		logo: undefined, // TODO: Get from Shopify API
		currency: 'USD', // TODO: Get from Shopify API
		country: 'US', // TODO: Get from Shopify API
		language: 'EN' // TODO: Get from Shopify API
	};

	// TODO: Get shop stats from Shopify API
	const stats = {
		totalProducts: 0, // TODO: Get from Shopify API
		totalCollections: 0, // TODO: Get from Shopify API
		totalOrders: undefined // TODO: Get from Shopify API
	};

	// Extract theme colors (simplified for now)
	const colors = {
		primary: '#121212', // TODO: Extract from settingsData
		secondary: '#666666',
		background: '#ffffff',
		text: '#121212',
		button: '#121212',
		buttonText: '#ffffff'
	};

	// Extract theme typography (simplified for now)
	const typography = {
		headingFont: 'Assistant', // TODO: Extract from settingsData
		bodyFont: 'Assistant',
		headingScale: 100,
		bodyScale: 100
	};

	// Extract theme layout (simplified for now)
	const layout = {
		pageWidth: 1200, // TODO: Extract from settingsData
		spacing: 0,
		borderRadius: 0
	};

	return c.json(
		{
			shop: shopInfo,
			theme: {
				id: theme.themeId,
				name: theme.themeName,
				role: theme.themeRole,
				colors,
				typography,
				layout
			},
			socialLinks,
			bestSellingProducts,
			stats
		},
		200
	);
});
