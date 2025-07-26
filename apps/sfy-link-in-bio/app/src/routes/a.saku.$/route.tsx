import { ServerErr, ServerOk } from '@blgc/utils';
import { TFlatSite, TIntegration } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { AppProxyProvider } from '@shopify/shopify-app-remix/react';
import { boundary } from '@shopify/shopify-app-remix/server';
import { isStatusCode } from 'feature-fetch';
import React from 'react';
import { coreApiClient, logger } from '@/environment';
import { shopify, shopifyConfig } from '@/environment/.server';
import {
	createPageContext,
	getSiteFontUrls,
	StaticNodeCanvas,
	TResolvedSite
} from '@/features/page-editor';
import { hydrateSite, StaticSiteHydrateContext } from '@/features/page-editor/.server';
import { resultLoader, withResultLoader } from '@/lib';
import styles from '@/styles.css?url';
import { THeadersFunction } from '@/types';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { appUrl, site } = data;
		const cx = React.useMemo(
			() =>
				createPageContext({
					siteId: site.id,
					integrations: site.integrations
				}),
			[site.id, site.integrations]
		);

		return (
			<AppProxyProvider appUrl={appUrl}>
				<link rel="stylesheet" href={`${appUrl}${styles}`} />
				{site.fontUrls.map((fontUrl, index) => (
					<link key={`font-${index}`} rel="stylesheet" href={fontUrl} />
				))}

				<StaticNodeCanvas cx={cx} nodes={[site.content.root]} />
			</AppProxyProvider>
		);
	},
	Error: ({ error }) => (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="flex flex-col items-center gap-2 text-center">
				<Text as="h2" variant="headingLg">
					Page Not Found
				</Text>
				<Text as="p" variant="bodyMd" tone="subdued">
					{error.code}: {error.message}
				</Text>
			</div>
		</div>
	)
});

export default Page;

export const headers: THeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ request }) => {
	let shop;
	try {
		const result = await shopify.authenticate.public.appProxy(request);
		shop = result.session?.shop;
	} catch (error) {
		logger.error('Failed to authenticate app proxy request', { error });
	}
	// TODO: Remove this once we have figured out why the app proxy signature is not correct in Production
	if (shop == null) {
		try {
			const url = new URL(request.url);
			shop = url.searchParams.get('shop');
		} catch (error) {
			logger.error('Failed to get shop from URL', { error });
		}
	}

	const url = new URL(request.url);
	// Extract handle from path: /a/saku/bio -> "bio"
	const pathSegments = url.pathname.split('/').filter(Boolean);
	const handle = pathSegments[2]; // ['a', 'saku', 'bio']

	if (handle == null) {
		return ServerErr({
			code: '#ERR_BAD_REQUEST',
			message: 'No handle provided in URL'
		});
	}

	if (shop == null) {
		return ServerErr({
			code: '#ERR_UNAUTHORIZED',
			message: 'No shop provided in session'
		});
	}

	const result = await coreApiClient.get('/v1/shopify/site/shop/{shop}/{handle}', {
		pathParams: {
			shop,
			handle
		}
	});
	if (result.isErr()) {
		if (isStatusCode(result.error, 404)) {
			return ServerErr({
				code: '#ERR_NOT_FOUND',
				message: 'Site not found'
			});
		}

		return ServerErr({
			code: '#ERR_SERVER_ERROR',
			message: result.error.message ?? 'Unknown error occurred'
		});
	}
	const site = result.value.data;
	const flatSite = site.content as unknown as TFlatSite;

	return ServerOk({
		appUrl: shopifyConfig.appUrl,
		site: {
			id: site.id,
			content: hydrateSite(new StaticSiteHydrateContext(flatSite, site.id, handle)),
			integrations: Object.values(flatSite.integrations),
			fontUrls: getSiteFontUrls(flatSite)
		}
	});
});

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	appUrl: string;
	site: {
		id: string;
		content: TResolvedSite;
		integrations: TIntegration[];
		fontUrls: string[];
	};
}
