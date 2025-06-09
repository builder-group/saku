import { type HeadersFunction } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useRouteError } from '@remix-run/react';
import { NavMenu } from '@shopify/app-bridge-react';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import { AppProvider } from '@shopify/shopify-app-remix/react';
import { boundary } from '@shopify/shopify-app-remix/server';
import React from 'react';
import { shopifyConfig } from '../environment';
import { authenticate } from '../shopify.server';
import { TLoaderFunction } from '../types';

const Page: React.FC = () => {
	const { apiKey } = useLoaderData<typeof loader>();

	return (
		<AppProvider isEmbeddedApp apiKey={apiKey}>
			<NavMenu>
				<Link to="/app" rel="home">
					Home
				</Link>
				<Link to="/app/additional">Additional page</Link>
			</NavMenu>
			<Outlet />
		</AppProvider>
	);
};

export default Page;

export const links = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const headers: HeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};

export const loader: TLoaderFunction<{ apiKey: string }> = async ({ request }) => {
	await authenticate.admin(request);

	return { apiKey: shopifyConfig.apiKey };
};

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
	return boundary.error(useRouteError());
}
