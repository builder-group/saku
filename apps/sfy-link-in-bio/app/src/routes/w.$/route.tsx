import { fromServerResult, ServerErr, ServerOk } from '@blgc/utils';
import { TFlatSite, TIntegration } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { isStatusCode } from 'feature-fetch';
import React from 'react';
import { coreApiClient } from '@/environment';
import {
	createPageContext,
	extractSiteMetadata,
	getSiteFontUrls,
	StaticNodeCanvas,
	TResolvedSite
} from '@/features/page-editor';
import { hydrateSite, StaticSiteHydrateContext } from '@/features/page-editor/.server';
import { resultLoader, withResultLoader } from '@/lib';
import { TMetaFunction } from '@/types';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { site } = data;
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
				{site.fontUrls.map((fontUrl, index) => (
					<link key={`font-${index}`} rel="stylesheet" href={fontUrl} />
				))}

				<StaticNodeCanvas cx={cx} nodes={[site.content.root]} />
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

export const meta: TMetaFunction<typeof loader> = ({ data }) => {
	if (data == null) {
		return [];
	}

	const result = fromServerResult<TSuccessLoaderData, TErrorLoaderData>(data);
	if (result.isErr()) {
		return [
			{ title: 'Page Not Found - Saku' },
			{
				name: 'description',
				content: 'The requested page could not be found'
			}
		];
	}

	const loaderData = result.value;
	const { title: siteTitle, description: siteDescription } = extractSiteMetadata(
		loaderData.site.content
	);

	return [
		{ title: siteTitle },
		{
			name: 'description',
			content: siteDescription
		},
		{
			property: 'og:title',
			content: siteTitle
		},
		{
			property: 'og:description',
			content: siteDescription
		}
	];
};

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ request }) => {
	const url = new URL(request.url);
	// Extract workspaceHandle and handle from path: /w/{workspaceHandle}/{handle}
	const pathSegments = url.pathname.split('/').filter(Boolean); // ['w', '{workspaceHandle}', '{handle}']

	const workspaceHandle = pathSegments[1];
	if (workspaceHandle == null) {
		return ServerErr({
			code: '#ERR_BAD_REQUEST',
			message: 'No workspace handle provided in URL'
		});
	}

	const handle = pathSegments[2];
	if (handle == null) {
		return ServerErr({
			code: '#ERR_BAD_REQUEST',
			message: 'No handle provided in URL'
		});
	}

	const result = await coreApiClient.get('/v1/site/workspace/{workspaceHandle}/{handle}', {
		pathParams: {
			workspaceHandle,
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
	site: {
		id: string;
		content: TResolvedSite;
		integrations: TIntegration[];
		fontUrls: string[];
	};
}
