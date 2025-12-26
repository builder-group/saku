import { TFlatSite } from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Text } from '@shopify/polaris';
import { boundary } from '@shopify/shopify-app-react-router/server';
import React from 'react';
import { Err, Ok, unwrapOrUndefined } from 'tuple-result';
import { AppContext, shopifyConfig } from '@/.server/environment';
import { coreApiClient } from '@/environment';
import { createPageEditor, PageEditor, TSiteUrl } from '@/features/page-editor';
import { createShopifyTokenMiddleware, resultLoader, withResultLoader } from '@/lib';
import { THeadersFunction, TLinksFunction } from '@/types';
import styles from './styles.css?url';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { site, shopId } = data;
		const shopify = useAppBridge();

		const editor = React.useMemo(() => {
			return createPageEditor({
				site,
				shopId,
				shopify
			});
		}, [site, shopId, shopify]);

		return (
			<div className="flex min-h-screen w-full">
				<PageEditor editor={editor} />
			</div>
		);
	},
	Error: ({ error }) => (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="flex flex-col items-center gap-2 text-center">
				<Text as="h2" variant="headingLg">
					Error Loading Editor
				</Text>
				<Text as="p" variant="bodyMd" tone="subdued">
					{error.code}: {error.message}
				</Text>
			</div>
		</div>
	)
});

export default Page;

export const links: TLinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const headers: THeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(
	async ({ request, context }) => {
		const {
			workspace,
			shopify: {
				sessionToken,
				admin: { session }
			}
		} = context.get(AppContext);
		const url = new URL(request.url);
		const siteId = url.searchParams.get('siteId');
		if (siteId == null) {
			return Err({
				code: '#ERR_BAD_REQUEST' as const,
				message: 'No siteId provided in URL'
			}).toArray();
		}

		const siteResult = await coreApiClient.get('/v1/site/{siteId}', {
			pathParams: {
				siteId
			}
		});
		if (siteResult.isErr()) {
			return Err({
				code: '#ERR_SERVER_ERROR' as const,
				message: siteResult.error.message ?? 'Unknown error occurred'
			}).toArray();
		}
		const site = siteResult.value.data;
		const flatSite = site.content as unknown as TFlatSite;

		// Get shop primary URL
		const primaryUrlResponse = unwrapOrUndefined(
			await coreApiClient.get('/v1/shopify/shop/primary-url', {
				requestMiddlewares: [createShopifyTokenMiddleware(sessionToken)]
			})
		);
		const primaryUrl = primaryUrlResponse?.data.primaryDomain?.url;

		return Ok({
			site: {
				id: site.id,
				handle: site.handle,
				displayName: site.displayName,
				baseUrl: {
					platform: `https://saku.so/w`,
					proxy: `${shopifyConfig.proxy.url(session.shop)}`,
					primary: primaryUrl != null ? `${primaryUrl}` : `${shopifyConfig.url(session.shop)}`
				},
				content: flatSite
			},
			shopId: session.shop
		}).toArray();
	}
);

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	site: {
		id: string;
		handle: string;
		displayName?: string;
		baseUrl: TSiteUrl;
		content: TFlatSite;
	};
	shopId: string;
}
