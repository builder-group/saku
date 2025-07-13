import { ServerErr, ServerOk } from '@blgc/utils';
import { TSite } from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Spinner, Text } from '@shopify/polaris';
import { withGlobalBind } from 'feature-react/state';
import React from 'react';
import { coreApiClient } from '@/environment';
import { shopify, shopifyConfig } from '@/environment/.server';
import { createPageEditor, Editor } from '@/features/page-editor';
import { withLoaderResult } from '@/lib';
import { TLinksFunction, TLoaderFunctionWithResult } from '@/types';
import styles from './styles.css?url';

const Page = withLoaderResult<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { site, shopId } = data;
		const shopify = useAppBridge();

		const editor = React.useMemo(() => {
			const editor = createPageEditor(
				{ ...site.content, id: site.id, handle: site.handle, url: site.url },
				{ shopify, shopId }
			);
			withGlobalBind(`__editor_${editor.id}`, editor);
			return editor;
		}, [site.content, site.id, site.handle, site.url, shopify, shopId]);

		return (
			<div className="flex min-h-screen w-full">
				{editor != null ? <Editor editor={editor} /> : <div>No site</div>}
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
	),
	Loading: () => (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="flex flex-col items-center gap-2">
				<Spinner size="small" />
				<Text as="p" variant="bodyMd" tone="subdued">
					Loading Editor...
				</Text>
			</div>
		</div>
	)
});

export default Page;

export const loader: TLoaderFunctionWithResult<TSuccessLoaderData, TErrorLoaderData> = async ({
	request
}) => {
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
	const siteData = siteResult.value.data;

	return ServerOk({
		site: {
			id: siteData.id,
			handle: siteData.handle,
			url: `${shopifyConfig.proxy.url(shop)}/${siteData.handle}`,
			content: siteData.content as unknown as TSite
		},
		shopId: shop
	});
};

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	site: {
		id: string;
		handle: string;
		url: string;
		content: TSite;
	};
	shopId: string;
}

export const links: TLinksFunction = () => [{ rel: 'stylesheet', href: styles }];
