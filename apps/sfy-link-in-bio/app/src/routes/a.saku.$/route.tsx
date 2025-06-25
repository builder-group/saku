import { ServerErr, ServerOk } from '@blgc/utils';
import { AppProxyProvider } from '@shopify/shopify-app-remix/react';
import { RequestError } from 'feature-fetch';
import React from 'react';
import { coreApiClient } from '@/environment';
import { shopify, shopifyConfig } from '@/environment/.server';
import { getBlocks, StaticBlockCanvas, TSiteNode } from '@/features/editor';
import { useLoaderResult } from '@/hooks';
import { TLoaderFunctionWithResult } from '@/types';

const Page: React.FC = () => {
	const result = useLoaderResult<TSuccessData, TErrorData>();

	if (result.isErr()) {
		return <p>{`${result.error.code}: ${result.error.message}`}</p>;
	}

	const { appUrl, siteNode } = result.value;
	const blocks = getBlocks(siteNode);
	if (blocks == null) {
		return null;
	}

	return (
		<AppProxyProvider appUrl={appUrl}>
			<link rel="stylesheet" href={`${appUrl}/src/styles.css`} />

			<StaticBlockCanvas blocks={blocks} />
		</AppProxyProvider>
	);
};

export default Page;

export const loader: TLoaderFunctionWithResult<TSuccessData, TErrorData> = async ({ request }) => {
	const { session } = await shopify.authenticate.public.appProxy(request);

	const url = new URL(request.url);
	// Extract handle from path: /a/saku/bio -> "bio"
	const pathSegments = url.pathname.split('/').filter(Boolean);
	const handle = pathSegments[2]; // ['a', 'saku', 'bio']

	if (handle == null) {
		return ServerErr<TSuccessData, TErrorData>({
			code: '#ERR_BAD_REQUEST',
			message: 'No handle provided in URL'
		});
	}

	if (session?.shop == null) {
		return ServerErr<TSuccessData, TErrorData>({
			code: '#ERR_UNAUTHORIZED',
			message: 'No shop provided in session'
		});
	}

	const result = await coreApiClient.get('/v1/shopify/site/shop/{shop}/{handle}/content', {
		pathParams: {
			shop: session.shop,
			handle
		}
	});
	if (result.isErr()) {
		if (result.error instanceof RequestError && result.error.status === 404) {
			return ServerErr<TSuccessData, TErrorData>({
				code: '#ERR_NOT_FOUND',
				message: 'Site not found'
			});
		}

		return ServerErr<TSuccessData, TErrorData>({
			code: '#ERR_SERVER_ERROR',
			message: result.error.message
		});
	}

	return ServerOk<TSuccessData, TErrorData>({
		appUrl: shopifyConfig.appUrl,
		siteNode: result.value.data as unknown as TSiteNode
	});
};

interface TErrorData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessData {
	appUrl: string;
	siteNode: TSiteNode;
}
