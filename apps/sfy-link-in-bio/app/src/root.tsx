import React from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { TLinksFunction } from '@/types';
import { RootProviders } from './providers';
import styles from './styles.css?url'; // ?url required for Shopify app hot reloading

const Root: React.FC = () => {
	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<link rel="preconnect" href="https://cdn.shopify.com/" />
				<link rel="stylesheet" href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css" />
				<Meta />
				<Links />
			</head>
			<body>
				<RootProviders>
					<Outlet />
					<ScrollRestoration />
					<Scripts />
				</RootProviders>
			</body>
		</html>
	);
};

export default Root;

export const links: TLinksFunction = () => [{ rel: 'stylesheet', href: styles }];
