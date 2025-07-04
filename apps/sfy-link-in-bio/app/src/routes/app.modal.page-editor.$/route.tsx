import { ServerErr, ServerOk } from '@blgc/utils';
import { TSite } from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { withGlobalBind } from 'feature-react/state';
import React from 'react';
import { coreApiClient } from '@/environment';
import { shopify, shopifyConfig } from '@/environment/.server';
import { createPageEditor, Editor } from '@/features/page-editor';
import { useLoaderResult } from '@/hooks';
import { TLinksFunction, TLoaderFunctionWithResult } from '@/types';
import styles from './styles.css?url';

const Page: React.FC = () => {
	const loaderResult = useLoaderResult<TSuccessLoaderData, TErrorLoaderData>();
	const shopify = useAppBridge();

	const editor = React.useMemo(() => {
		if (loaderResult.isErr()) {
			return null;
		}
		const { siteContent, siteUrl } = loaderResult.value;

		const editor = createPageEditor(siteContent, siteUrl, shopify);
		withGlobalBind(`__editor_${editor.id}`, editor);
		return editor;
	}, [loaderResult, shopify]);

	if (loaderResult.isErr()) {
		return <p>{`${loaderResult.error.code}: ${loaderResult.error.message}`}</p>;
	}

	return (
		<div className="flex min-h-screen w-full">
			{editor != null ? <Editor editor={editor} /> : <div>No site</div>}
		</div>
	);
};

export default Page;

export const loader: TLoaderFunctionWithResult<TSuccessLoaderData, TErrorLoaderData> = async ({
	request
}) => {
	const { session } = await shopify.authenticate.admin(request);
	const { shop } = session;
	const url = new URL(request.url);
	const siteId = url.searchParams.get('siteId');
	if (siteId == null) {
		return ServerErr<TSuccessLoaderData, TErrorLoaderData>({
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
		return ServerErr<TSuccessLoaderData, TErrorLoaderData>({
			code: '#ERR_SERVER_ERROR',
			message: siteResult.error.message ?? 'Unknown error occurred'
		});
	}
	const siteData = siteResult.value.data;

	return ServerOk({
		siteUrl: `${shopifyConfig.proxy.url(shop)}/${siteData.handle}`,
		siteContent: siteData.content as unknown as TSite
	});
};

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	siteUrl: string;
	siteContent: TSite;
}

export const links: TLinksFunction = () => [{ rel: 'stylesheet', href: styles }];
