import { TFlatSite, TIntegration } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { isStatusCode } from 'feature-fetch';
import React from 'react';
import { Err, Ok } from 'tuple-result';
import { shopifyConfig } from '@/.server/environment';
import { authenticateAppProxy } from '@/.server/lib';
import { appConfig, coreApiClient, logger } from '@/environment';
import {
	createPageContext,
	getSiteMetadata,
	StaticNodeCanvas,
	TResolvedSite
} from '@/features/page-editor';
import { hydrateSite, StaticSiteHydrateContext } from '@/features/page-editor/.server';
import { resultLoader, withResultLoader } from '@/lib';
import styles from '@/styles.css?url';
import { THeadersFunction, TMetaFunction } from '@/types';

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
			<>
				{appConfig.env === 'development' && (
					// Note: Manually injecting styles, fonts, and base href in dev because meta tags (from meta export) don't get applied when using Cloudflare tunnel + App Proxy context
					<>
						<base href={appUrl} />
						<link rel="stylesheet" href={`${appUrl}${styles}`} />
						{site.fontUrls.map((url, index) => (
							<link key={`font-${index}`} rel="stylesheet" href={url} />
						))}
					</>
				)}
				<StaticNodeCanvas cx={cx} nodes={[site.root]} />
			</>
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

export const meta: TMetaFunction<typeof loader> = ({ loaderData }) => {
	if (loaderData == null) {
		return [];
	}

	const [isOk, , result] = loaderData;
	if (!isOk) {
		return [
			{ title: 'Page Not Found - Saku' },
			{
				name: 'description',
				content: 'The requested page could not be found'
			}
		];
	}

	return [
		// Note: <base> tag is handled in `root.tsx` loader because React Router meta export doesn't support <base> tags (https://github.com/remix-run/react-router/issues/14466)
		//
		// We don't use AppProxyProvider because it renders <base> in body (not head), so too late for some resources
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base
		// https://github.com/Shopify/shopify-app-js/blob/main/packages/apps/shopify-app-react-router/src/react/components/AppProxyProvider/AppProxyProvider.tsx
		// { tagName: 'base', href: result.appUrl },
		{ tagName: 'link', rel: 'stylesheet', href: styles },
		...(getSiteMetadata(result.site) ?? [])
	];
};

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ request }) => {
	const authResult = await authenticateAppProxy(request, {
		enableFallback: true
	});

	logger.info('App proxy authentication', {
		method: authResult.method,
		shop:
			authResult.method === 'unverified'
				? authResult.shop
				: authResult.method === 'official' || authResult.method === 'fallback'
					? authResult.context.session?.shop
					: null,
		...(authResult.method === 'unverified' || authResult.method === 'invalid'
			? { error: authResult.error }
			: {})
	});

	let shop: string | null = null;
	switch (authResult.method) {
		case 'official':
		case 'fallback':
			shop = authResult.context.session?.shop || null;
			break;
		case 'unverified':
			// Note: Allow unverified requests in production for signature issues
			shop = authResult.shop;
			break;
		case 'invalid':
			return Err({
				code: '#ERR_BAD_REQUEST' as const,
				message: 'Invalid app proxy request'
			}).toArray();
	}

	if (shop == null) {
		logger.error('No shop provided in session', authResult);
		return Err({
			code: '#ERR_BAD_REQUEST' as const,
			message: 'Invalid app proxy request'
		}).toArray();
	}

	// Extract handle from path: /a/saku/bio -> "bio"
	const url = new URL(request.url);
	const pathSegments = url.pathname.split('/').filter(Boolean);
	const handle = pathSegments[2]; // ['a', 'saku', 'bio']
	if (handle == null) {
		return Err({
			code: '#ERR_BAD_REQUEST' as const,
			message: 'No handle provided in URL'
		}).toArray();
	}

	const result = await coreApiClient.get('/v1/shopify/site/shop/{shop}/{handle}', {
		pathParams: {
			shop,
			handle
		}
	});
	if (result.isErr()) {
		if (isStatusCode(result.error, 404)) {
			return Err({
				code: '#ERR_NOT_FOUND' as const,
				message: 'Site not found'
			}).toArray();
		}

		return Err({
			code: '#ERR_SERVER_ERROR' as const,
			message: result.error.message ?? 'Unknown error occurred'
		}).toArray();
	}
	const site = result.value.data;
	const flatSite = site.content as unknown as TFlatSite;

	const hydrateSiteResult = hydrateSite(new StaticSiteHydrateContext(flatSite, site.id, handle));
	if (hydrateSiteResult.isErr()) {
		return Err({
			code: '#ERR_SERVER_ERROR' as const,
			message: 'Failed to hydrate site'
		}).toArray();
	}

	return Ok({
		appUrl: shopifyConfig.appUrl,
		site: {
			...hydrateSiteResult.value,
			id: site.id,
			integrations: Object.values(flatSite.integrations)
		}
	}).toArray();
});

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	appUrl: string;
	site: {
		id: string;
		integrations: TIntegration[];
	} & TResolvedSite;
}
