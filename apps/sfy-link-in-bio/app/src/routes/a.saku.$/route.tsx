import { ServerErr, ServerOk } from '@blgc/utils';
import { AppProxyProvider } from '@shopify/shopify-app-remix/react';
import { isStatusCode } from 'feature-fetch';
import React from 'react';
import { appConfig, shopify, shopifyConfig } from '@/environment/.server';
import {
	getSiteFontUrls,
	kangarooPreset,
	resolveSite,
	StaticNodeCanvas,
	TResolvedSite,
	TSite
} from '@/features/page-editor';
import { useLoaderResult } from '@/hooks';
import { TLoaderFunctionWithResult } from '@/types';
import { coreApiClient } from '../../environment';

const Page: React.FC = () => {
	const result = useLoaderResult<TSuccessData, TErrorData>();

	if (result.isErr()) {
		return <p>{`${result.error.code}: ${result.error.message}`}</p>;
	}

	const { appUrl, site } = result.value;
	const fontUrls = getSiteFontUrls(site);

	return (
		<AppProxyProvider appUrl={appUrl}>
			<link rel="stylesheet" href={`${appUrl}/src/styles.css`} />
			{fontUrls.map((fontUrl, index) => (
				<link key={`font-${index}`} rel="stylesheet" href={fontUrl} />
			))}

			<StaticNodeCanvas nodes={[site.root]} />
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

	// Return kangaroo preset for now if local env and handle is "preset"
	if (appConfig.env === 'local' && handle === 'preset') {
		return ServerOk<TSuccessData, TErrorData>({
			appUrl: shopifyConfig.appUrl,
			site: resolveSite(kangarooPreset)
		});
	}

	const result = await coreApiClient.get('/v1/shopify/site/shop/{shop}/{handle}/content', {
		pathParams: {
			shop: session.shop,
			handle
		}
	});
	if (result.isErr()) {
		if (isStatusCode(result.error, 404)) {
			return ServerErr<TSuccessData, TErrorData>({
				code: '#ERR_NOT_FOUND',
				message: 'Site not found'
			});
		}

		return ServerErr<TSuccessData, TErrorData>({
			code: '#ERR_SERVER_ERROR',
			message: result.error.message ?? 'Unknown error occurred'
		});
	}

	return ServerOk<TSuccessData, TErrorData>({
		appUrl: shopifyConfig.appUrl,
		site: resolveSite(result.value.data as unknown as TSite)
	});
};

interface TErrorData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessData {
	appUrl: string;
	site: TResolvedSite;
}
