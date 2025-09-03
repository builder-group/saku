import { TFlatSite, TIntegration } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { isStatusCode } from 'feature-fetch';
import React from 'react';
import { Err, Ok } from 'tuple-result';
import { coreApiClient } from '@/environment';
import {
	createPageContext,
	getSiteMetadata,
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

		return <StaticNodeCanvas cx={cx} nodes={[site.root]} />;
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

	const [isOk, , result] = data;
	if (!isOk) {
		return [
			{ title: 'Page Not Found - Saku' },
			{
				name: 'description',
				content: 'The requested page could not be found'
			}
		];
	}

	return getSiteMetadata(result.site);
};

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ request }) => {
	const url = new URL(request.url);
	// Extract workspaceHandle and handle from path: /w/{workspaceHandle}/{handle}
	const pathSegments = url.pathname.split('/').filter(Boolean); // ['w', '{workspaceHandle}', '{handle}']

	const workspaceHandle = pathSegments[1];
	if (workspaceHandle == null) {
		return Err({
			code: '#ERR_BAD_REQUEST' as const,
			message: 'No workspace handle provided in URL'
		}).toArray();
	}

	const handle = pathSegments[2];
	if (handle == null) {
		return Err({
			code: '#ERR_BAD_REQUEST' as const,
			message: 'No handle provided in URL'
		}).toArray();
	}

	const result = await coreApiClient.get('/v1/site/workspace/{workspaceHandle}/{handle}', {
		pathParams: {
			workspaceHandle,
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
	site: {
		id: string;
		integrations: TIntegration[];
	} & TResolvedSite;
}
