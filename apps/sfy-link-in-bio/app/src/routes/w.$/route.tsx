import { ServerErr, ServerOk } from '@blgc/utils';
import { TFlatSite } from '@repo/editor';
import { Spinner, Text } from '@shopify/polaris';
import { isStatusCode } from 'feature-fetch';
import { coreApiClient } from '@/environment';
import {
	getSiteFontUrls,
	resolveSite,
	StaticNodeCanvas,
	StaticSiteResolveContext,
	TResolvedSite
} from '@/features/page-editor';
import { withLoaderResult } from '@/lib';
import { TLoaderFunctionWithResult } from '@/types';

const Page = withLoaderResult<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { site, fontUrls } = data;

		return (
			<>
				{fontUrls.map((fontUrl, index) => (
					<link key={`font-${index}`} rel="stylesheet" href={fontUrl} />
				))}

				<StaticNodeCanvas nodes={[site.root]} />
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
	),
	Loading: () => (
		<div className="flex min-h-screen items-center justify-center">
			<div className="flex flex-col items-center gap-2">
				<Spinner size="small" />
				<Text as="p" variant="bodyMd" tone="subdued">
					Loading...
				</Text>
			</div>
		</div>
	)
});

export default Page;

export const loader: TLoaderFunctionWithResult<TSuccessLoaderData, TErrorLoaderData> = async ({
	request
}) => {
	const url = new URL(request.url);
	// Extract workspaceHandle and handle from path: /w/{workspaceHandle}/{handle}
	const pathSegments = url.pathname.split('/').filter(Boolean); // ['w', '{workspaceHandle}', '{handle}']
	const workspaceHandle = pathSegments[1];
	const handle = pathSegments[2];

	if (!workspaceHandle) {
		return ServerErr({
			code: '#ERR_BAD_REQUEST',
			message: 'No workspace handle provided in URL'
		});
	}

	if (!handle) {
		return ServerErr({
			code: '#ERR_BAD_REQUEST',
			message: 'No handle provided in URL'
		});
	}

	const result = await coreApiClient.get('/v1/site/workspace/{workspaceHandle}/{handle}/content', {
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

	const flatSite = result.value.data as unknown as TFlatSite;

	return ServerOk({
		site: resolveSite(new StaticSiteResolveContext(flatSite)),
		fontUrls: getSiteFontUrls(flatSite)
	});
};

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	site: TResolvedSite;
	fontUrls: string[];
}
