import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import React from 'react';
import styles from './styles.css';
import { TLinksFunction } from './types';

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
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
};

export default Root;

export const links: TLinksFunction = () => [{ rel: 'stylesheet', href: styles }];
