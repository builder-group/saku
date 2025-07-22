import { ServerErr, ServerOk } from '@blgc/utils';
import { TFlatSite } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { AppProxyProvider } from '@shopify/shopify-app-remix/react';
import { isStatusCode } from 'feature-fetch';
import { coreApiClient } from '@/environment';
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

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { appUrl, site, fontUrls, storefrontAccessToken } = data;
		const cx = React.useMemo(
			() =>
				createPageContext({
					siteId: site.id,
					storefrontAccessToken: storefrontAccessToken
				}),
			[site.id, storefrontAccessToken]
		);

		return (
			<AppProxyProvider appUrl={appUrl}>
				<link rel="stylesheet" href={`${appUrl}${styles}`} />
				{fontUrls.map((fontUrl, index) => (
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

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ request }) => {
	const { session } = await shopify.authenticate.public.appProxy(request);

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

	if (session?.shop == null) {
		return ServerErr({
			code: '#ERR_UNAUTHORIZED',
			message: 'No shop provided in session'
		});
	}

	const result = await coreApiClient.get('/v1/shopify/site/shop/{shop}/{handle}', {
		pathParams: {
			shop: session.shop,
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

	return ServerOk({
		appUrl: shopifyConfig.appUrl,
		site: {
			id: site.id,
			content: hydrateSite(
				new StaticSiteHydrateContext(site.content as unknown as TFlatSite, session.shop, handle)
			)
		},
		fontUrls: getSiteFontUrls(site.content as unknown as TFlatSite),
		storefrontAccessToken: site.storefrontAccessToken
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
	};
	fontUrls: string[];
	storefrontAccessToken: string;
}
