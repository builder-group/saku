import { TRgba } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { coreApiClient } from '@/environment';
import { createShopifyTokenMiddleware } from '@/lib';

export async function fetchSpotifyTheme(
	url: string,
	shopify: ShopifyGlobal
): Promise<TSpotifyTheme | null> {
	const result = await coreApiClient.get('/v1/spotify/theme', {
		queryParams: { url },
		requestMiddlewares: [createShopifyTokenMiddleware(shopify)]
	});
	if (result.isErr()) {
		return null;
	}

	const spotifyTheme = result.value.data;
	return {
		backgroundBase: spotifyTheme.theme?.['backgroundBase'] as TRgba,
		backgroundTinted: spotifyTheme.theme?.['backgroundTinted'] as TRgba,
		textBase: spotifyTheme.theme?.['textBase'] as TRgba,
		textSubdued: spotifyTheme.theme?.['textSubdued'] as TRgba
	};
}

export interface TSpotifyTheme {
	backgroundBase?: TRgba;
	backgroundTinted?: TRgba;
	textBase?: TRgba;
	textSubdued?: TRgba;
}
