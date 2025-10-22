import React from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { WindowSize } from '@/components';
import { appConfig } from '@/environment';
import { TLinksFunction } from '@/types';
import { RootProviders } from './providers';
import styles from './styles.css?url';

const Root: React.FC = () => {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
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
	},
	{ rel: 'stylesheet', href: styles }
];
