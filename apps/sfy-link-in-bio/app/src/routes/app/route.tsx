import { shortId } from '@blgc/utils';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import polarisTranslations from '@shopify/polaris/locales/en.json';
import { boundary } from '@shopify/shopify-app-react-router/server';
import React from 'react';
import { Link, Outlet, useLoaderData, useRouteError } from 'react-router';
import { shopify, shopifyConfig } from '@/.server/environment';
import { EmbeddedAppProvider, TChatwootUserData, TEmbeddedAppProviderI18n } from '@/components';
import { createDisplayNameFromShop } from '@/lib';
import { THeadersFunction, TLoaderFunction } from '@/types';

const Page: React.FC = () => {
	const { shopifyApiKey, mantleApiToken, polarisTranslations, chatwootUserData } =
		useLoaderData<typeof loader>();

	return (
		<EmbeddedAppProvider
			shopifyApiKey={shopifyApiKey}
			i18n={polarisTranslations}
			mantleApiToken={mantleApiToken}
			chatwootUserData={chatwootUserData}
		>
			<ui-nav-menu>
				<Link to="/app" rel="home">
					Home
				</Link>
				<Link to="/app/settings">Settings</Link>
			</ui-nav-menu>
			<Outlet />
		</EmbeddedAppProvider>
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

export const loader: TLoaderFunction<TLoaderData> = async ({ request }) => {
	const { session } = await shopify.authenticate.admin(request);
	const user = session.onlineAccessInfo?.associated_user;

	return {
		shopifyApiKey: shopifyConfig.apiKey,
		mantleApiToken: session.additionalData?.mantleApiToken,
		polarisTranslations,
		chatwootUserData: {
			identifier: user != null ? `user_${user.id}` : `anonymous_${shortId()}`,
			...(user != null
				? {
						email: user.email,
						name: `${user.first_name} ${user.last_name}`
					}
				: {}),
			companyName: createDisplayNameFromShop(session.shop),
			additionalData: {
				shopDomain: session.shop,
				shopId: session.shop,
				...(user != null
					? {
							userRole: user.account_owner ? 'owner' : 'collaborator',
							accountOwner: user.account_owner,
							locale: user.locale
						}
					: {}),
				plan: 'free'
			}
		}
	};
};

interface TLoaderData {
	shopifyApiKey: string;
	mantleApiToken?: string;
	polarisTranslations: TEmbeddedAppProviderI18n;
	chatwootUserData: TChatwootUserData;
}
