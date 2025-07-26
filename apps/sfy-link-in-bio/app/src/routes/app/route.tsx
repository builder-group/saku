import { AppProvider } from '@shopify/shopify-app-react-router/react';
import { boundary } from '@shopify/shopify-app-react-router/server';
import React from 'react';
import { Link, Outlet, useLoaderData, useRouteError } from 'react-router';
import { shopify, shopifyConfig } from '@/environment/.server';
import { THeadersFunction, TLoaderFunction } from '@/types';

const Page: React.FC = () => {
	const { apiKey } = useLoaderData<typeof loader>();

	return (
		<AppProvider embedded apiKey={apiKey}>
			<ui-nav-menu>
				<Link to="/app" rel="home">
					Home
				</Link>
				<Link to="/app/settings">Settings</Link>
			</ui-nav-menu>
			<Outlet />
		</AppProvider>
	);
};

export default Page;

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response
export function ErrorBoundary() {
	return boundary.error(useRouteError());
}

export const headers: THeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};

export const loader: TLoaderFunction<{ apiKey: string }> = async ({ request }) => {
	await shopify.authenticate.admin(request);

	return { apiKey: shopifyConfig.apiKey };
};
