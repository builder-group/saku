import { shortId, sleep } from '@blgc/utils';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import polarisTranslations from '@shopify/polaris/locales/en.json';
import { boundary } from '@shopify/shopify-app-react-router/server';
import React from 'react';
import {
	Link,
	MiddlewareFunction,
	Outlet,
	redirect,
	useLoaderData,
	useLocation,
	useRouteError
} from 'react-router';
import { unwrapOr } from 'tuple-result';
import { AppContext, shopify, shopifyConfig } from '@/.server/environment';
import { getSessionTokenFromRequest, redirectWithAuth } from '@/.server/lib';
import {
	EmbeddedAppProvider,
	TEmbeddedAppProviderI18n,
	TEmbeddedAppProviderUserContext
} from '@/components';
import { appConfig, coreApiClient, logger } from '@/environment';
import {
	checkOnboardingStatus,
	createDisplayNameFromShop,
	createShopifyTokenMiddleware
} from '@/lib';
import { THeadersFunction, TLoaderFunction } from '@/types';

const Page: React.FC = () => {
	const { shopifyApiKey, mantleApiToken, polarisTranslations, userContext, completedOnboarding } =
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
			disabledPosthog={!appConfig.featureFlags.posthog}
			disabledCrisp={!appConfig.featureFlags.crisp}
			disabledCrispCallbacks={disabledCrispCallbacks}
			disabledMantle={!appConfig.featureFlags.mantle}
		>
			{completedOnboarding && (
				<ui-nav-menu>
					<Link to="/app" rel="home">
						Home
					</Link>
					<Link to="/app/pages">Pages</Link>
					<Link to="/app/settings">Settings</Link>
					<Link to="/app/help">Help & Resources</Link>
				</ui-nav-menu>
			)}
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
	const sessionToken = getSessionTokenFromRequest(request);

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
		},
		completedOnboarding:
			sessionToken != null ? unwrapOr(await checkOnboardingStatus(sessionToken), false) : false
	};
};

interface TLoaderData {
	shopifyApiKey: string;
	mantleApiToken?: string;
	polarisTranslations: TEmbeddedAppProviderI18n;
	userContext: TEmbeddedAppProviderUserContext;
	completedOnboarding: boolean;
}

export const middleware: MiddlewareFunction[] = [
	async ({ request, context }) => {
		const url = new URL(request.url);
		const shopifyAdminCx = await shopify.authenticate.admin(request);

		// Extract session token from request
		const sessionToken = getSessionTokenFromRequest(request);
		if (sessionToken == null) {
			logger.error('[app-middleware] No session token provided');
			throw redirect('/auth/login');
		}

		// Try to get workspace
		const [isWorkspaceOk, workspaceErr, workspaceResponse] = await coreApiClient.get(
			'/v1/shopify/workspace',
			{
				requestMiddlewares: [createShopifyTokenMiddleware(sessionToken)]
			}
		);
		if (!isWorkspaceOk) {
			logger.error('[app-middleware] Could not get workspace', workspaceErr);

			// Check redirect count to prevent infinite loops
			const redirectCount = parseInt(url.searchParams.get('redirect_count') ?? '0', 10);
			if (redirectCount >= 5) {
				logger.error('[app-middleware] Max redirect attempts reached, redirecting to login');
				throw redirect('/auth/login');
			}

			// Redirect to /app to retry - workspace might still be creating in background
			const redirectUrl = new URL('/app', url.origin);
			redirectUrl.searchParams.set('redirect_count', String(redirectCount + 1));
			await sleep(Math.min(Math.pow(2, redirectCount) * 500, 4000)); // Exponential backoff: 500ms, 1s, 2s, 4s
			throw redirect(redirectUrl.pathname + redirectUrl.search);
		}
		const workspace = workspaceResponse.data;

		// Redirect to onboarding if not completed and not already on onboarding route
		if (!url.pathname.endsWith('/app/onboarding') && workspace.onboardingCompletedAt == null) {
			logger.error('[app-middleware] Onboarding not complete');
			throw redirectWithAuth(request, '/app/onboarding');
		}

		context.set(AppContext, {
			workspace,
			shopify: { sessionToken, admin: shopifyAdminCx }
		});
	}
];
