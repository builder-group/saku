import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import polarisTranslations from '@shopify/polaris/locales/en.json';
import { boundary } from '@shopify/shopify-app-react-router/server';
import React from 'react';
import { Link, Outlet, useLoaderData, useRouteError } from 'react-router';
import { shopify, shopifyConfig } from '@/.server/environment';
import { AppProviderWithPolaris, TAppProviderWithPolarisI18n } from '@/components';
import { THeadersFunction, TLoaderFunction } from '@/types';

const Page: React.FC = () => {
	const { apiKey, polarisTranslations } = useLoaderData<typeof loader>();

	return (
		<AppProviderWithPolaris apiKey={apiKey} i18n={polarisTranslations}>
			<ui-nav-menu>
				<Link to="/app" rel="home">
					Home
				</Link>
				<Link to="/app/settings">Settings</Link>
			</ui-nav-menu>
			<Outlet />
		</AppProviderWithPolaris>
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

export const links = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const loader: TLoaderFunction<{
	apiKey: string;
	polarisTranslations: TAppProviderWithPolarisI18n;
}> = async ({ request }) => {
	await shopify.authenticate.admin(request);

	return { apiKey: shopifyConfig.apiKey, polarisTranslations };
};
