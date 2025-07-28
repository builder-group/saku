import { ServerErr, ServerOk } from '@blgc/utils';
import { TFlatSite } from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Text } from '@shopify/polaris';
import { boundary } from '@shopify/shopify-app-react-router/server';
import React from 'react';
import { shopify, shopifyConfig } from '@/.server/environment';
import { coreApiClient } from '@/environment';
import { createPageEditor, Editor } from '@/features/page-editor';
import { resultLoader, withResultLoader } from '@/lib';
import { THeadersFunction, TLinksFunction } from '@/types';
import styles from './styles.css?url';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { site } = data;
		const shopify = useAppBridge();

		const editor = React.useMemo(() => {
			return createPageEditor({
				site,
				shopify
			});
		}, [site, shopify]);

		return (
			<div className="flex min-h-screen w-full">
				<Editor editor={editor} />
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

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ request }) => {
	const { session } = await shopify.authenticate.admin(request);
	const { shop } = session;
	const url = new URL(request.url);
	const siteId = url.searchParams.get('siteId');
	if (siteId == null) {
		return ServerErr({
			code: '#ERR_BAD_REQUEST',
			message: 'No siteId provided in URL'
		});
	}

	const siteResult = await coreApiClient.get('/v1/site/{siteId}', {
		pathParams: {
			siteId
		}
	});
	if (siteResult.isErr()) {
		return ServerErr({
			code: '#ERR_SERVER_ERROR',
			message: siteResult.error.message ?? 'Unknown error occurred'
		});
	}
	const site = siteResult.value.data;
	const flatSite = site.content as unknown as TFlatSite;

	return ServerOk({
		site: {
			id: site.id,
			handle: site.handle,
			url: `${shopifyConfig.proxy.url(shop)}/${site.handle}`,
			content: flatSite
		}
	});
});

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	site: {
		id: string;
		handle: string;
		url: string;
		content: TFlatSite;
	};
}
