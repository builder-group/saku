import { Link, Outlet, useLoaderData, useRouteError } from 'react-router';
import { NavMenu } from '@shopify/app-bridge-react';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import { AppProvider } from '@shopify/shopify-app-remix/react';
import { boundary } from '@shopify/shopify-app-remix/server';
import React from 'react';
import { shopify, shopifyConfig } from '@/environment/.server';
import { THeadersFunction, TLinksFunction, TLoaderFunction } from '@/types';

const Page: React.FC = () => {
	const { apiKey } = useLoaderData<typeof loader>();

	return (
		<AppProvider isEmbeddedApp apiKey={apiKey}>
			<NavMenu>
				<Link to="/app" rel="home">
					Home
				</Link>
				<Link to="/app/settings">Settings</Link>
			</NavMenu>
			<Outlet />
		</AppProvider>
	);
};

export default Page;

export const links: TLinksFunction = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const headers: THeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};

export const loader: TLoaderFunction<{ apiKey: string }> = async ({ request }) => {
	await shopify.authenticate.admin(request);

	return { apiKey: shopifyConfig.apiKey };
};

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
	return boundary.error(useRouteError());
}
