import { shortId } from '@blgc/utils';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import polarisTranslations from '@shopify/polaris/locales/en.json';
import { boundary } from '@shopify/shopify-app-react-router/server';
import React from 'react';
import { Link, Outlet, useLoaderData, useLocation, useRouteError } from 'react-router';
import { shopify, shopifyConfig } from '@/.server/environment';
import {
	EmbeddedAppProvider,
	TEmbeddedAppProviderI18n,
	TEmbeddedAppProviderUserContext
} from '@/components';
import { appConfig } from '@/environment';
import { createDisplayNameFromShop } from '@/lib';
import { THeadersFunction, TLoaderFunction } from '@/types';

const Page: React.FC = () => {
	const { shopifyApiKey, mantleApiToken, polarisTranslations, userContext } =
		useLoaderData<typeof loader>();
	const location = useLocation();

	// Disable Crisp callbacks (e.g. auto-response, debug) for modal routes to prevent duplicate callbacks
	// because Shopify modals create iframes, so we have two Crisp instances in the same browser tab
	const disabledCrispCallbacks = React.useMemo(() => {
		return location.pathname.includes('/modal/');
	}, [location.pathname]);

	return (
		<EmbeddedAppProvider
			shopifyApiKey={shopifyApiKey}
			i18n={polarisTranslations}
			mantleApiToken={mantleApiToken}
			userContext={userContext}
			disabledCrisp={!appConfig.featureFlags.crisp}
			disabledCrispCallbacks={disabledCrispCallbacks}
			disabledMantle={!appConfig.featureFlags.mantle}
		>
			<ui-nav-menu>
				<Link to="/app" rel="home">
					Home
				</Link>
				<Link to="/app/settings">Settings</Link>
				<Link to="/app/help">Help & Resources</Link>
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
		userContext: {
			identifier: user != null ? `user_${user.id}` : `anonymous_${shortId()}`,
			email: user?.email,
			name: user != null ? `${user.first_name} ${user.last_name}` : undefined,
			companyName: createDisplayNameFromShop(session.shop),
			additionalData: {
				shopDomain: session.shop,
				shopId: session.shop,
				userRole: user?.account_owner ? 'owner' : 'collaborator',
				accountOwner: user?.account_owner,
				locale: user?.locale,
				plan: 'free'
			}
		}
	};
};

interface TLoaderData {
	shopifyApiKey: string;
	mantleApiToken?: string;
	polarisTranslations: TEmbeddedAppProviderI18n;
	userContext: TEmbeddedAppProviderUserContext;
}
