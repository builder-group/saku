import React from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import { shopifyConfig } from '@/.server/environment';
import { WindowSize } from '@/components';
import { appConfig } from '@/environment';
import { TLinksFunction, TLoaderFunction } from '@/types';
import { RootProviders } from './providers';
import './styles.css';

const Root: React.FC = () => {
	const { baseUrl } = useLoaderData<TLoaderData>();

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				{baseUrl != null && <base href={baseUrl} />}
				<Meta />
				<Links />
			</head>
			<body>
				<RootProviders>
					<Outlet />
					<ScrollRestoration />
					<Scripts />
					{appConfig.env === 'development' && <WindowSize />}
				</RootProviders>
			</body>
		</html>
	);
};

export default Root;

export const links: TLinksFunction = () => [
	{ rel: 'preconnect', href: 'https://cdn.shopify.com' },
	{
		rel: 'stylesheet',
		href: 'https://cdn.shopify.com/static/fonts/inter/v4/styles.css'
	}
];

export const loader: TLoaderFunction<TLoaderData> = async ({ request }) => {
	const url = new URL(request.url);

	// Note: We detect app proxy routes here and return baseUrl because React Router meta export doesn't support <base> tags (https://github.com/remix-run/react-router/issues/14466).
	// The <base> tag must be in <head> before other URL-containing elements to work properly.
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base
	const isAppProxyRoute = url.pathname.startsWith('/a/');
	if (isAppProxyRoute) {
		return { baseUrl: shopifyConfig.appUrl };
	}

	return { baseUrl: undefined };
};

interface TLoaderData {
	baseUrl?: string;
}
