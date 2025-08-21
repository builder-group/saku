import { toFlatSite } from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, ButtonGroup, Text } from '@shopify/polaris';
import { boundary } from '@shopify/shopify-app-react-router/server';
import React from 'react';
import { ShouldRevalidateFunction, useNavigate, useSearchParams } from 'react-router';
import { Err, Ok } from 'tuple-result';
import { shopify } from '@/.server/environment';
import { getSessionTokenFromRequest, redirectWithAuth } from '@/.server/lib';
import { useCrisp } from '@/components';
import { appConfig, coreApiClient } from '@/environment';
import { blankPreset } from '@/features/page-editor/.server';
import { resultLoader, withResultLoader } from '@/lib';
import { THeadersFunction } from '@/types';
import {
	AccountConnectionStep,
	HandleStep,
	LinkpopPreviewStep,
	LinkpopUrlStep,
	SiteCreationOptionsStep,
	TemplatesStep,
	WelcomeStep
} from './components';
import {
	createOnboardingContext,
	TSitePreset,
	type TOnboardingContext,
	type TOnboardingStep
} from './create-onboarding-context';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { shop, presets } = data;
		const navigate = useNavigate();
		const [searchParams] = useSearchParams();
		const shopifyBridge = useAppBridge();
		const stepParam = React.useMemo(
			() => searchParams.get('step') as TOnboardingStep['type'] | null,
			[searchParams]
		);
		const crisp = useCrisp();

		const onboardingContext = React.useMemo<TOnboardingContext>(() => {
			return createOnboardingContext({
				shopify: shopifyBridge,
				shopId: shop,
				presets,
				crisp: crisp ?? undefined
			});
		}, [shopifyBridge, shop, presets]);

		const [stepType, setStepType] = React.useState<TOnboardingStep['type']>('welcome');

		React.useEffect(() => {
			onboardingContext.mount();
		}, [onboardingContext]);

		React.useEffect(() => {
			if (stepParam != null && onboardingContext.stepr.goToVisited(stepParam)) {
				setStepType(stepParam);
				return;
			}

			// If not already on 'welcome', navigate to the initial 'welcome' step
			if (onboardingContext.stepr.current._v?.type !== 'welcome') {
				onboardingContext.stepr.goTo({ type: 'welcome' });
			}
			// Already on 'welcome' - update the URL silently
			else if (stepParam !== 'welcome') {
				navigate('?step=welcome', { replace: true });
			}
		}, [onboardingContext, stepParam, navigate]);

		React.useEffect(() => {
			const unsubscribe = onboardingContext.stepr.onStepVisited((cx) => {
				if (cx.value.type !== stepParam) {
					navigate(`?step=${cx.value.type}`, { replace: false });
					// Update UI immediately without waiting for navigation to complete.
					// This avoids a brief lack that would occur if we waited for the iframe to update.
					setStepType(cx.value.type);
				}
			});

			return () => {
				unsubscribe?.();
			};
		}, [onboardingContext, navigate, stepParam]);

		switch (stepType) {
			case 'welcome':
				return <WelcomeStep onboardingContext={onboardingContext} />;
			case 'account-connection':
				return <AccountConnectionStep onboardingContext={onboardingContext} />;
			case 'handle':
				return <HandleStep onboardingContext={onboardingContext} />;
			case 'site-creation-options':
				return <SiteCreationOptionsStep onboardingContext={onboardingContext} />;
			case 'linkpop-url':
				return <LinkpopUrlStep onboardingContext={onboardingContext} />;
			case 'linkpop-preview':
				return <LinkpopPreviewStep onboardingContext={onboardingContext} />;
			case 'templates':
				return <TemplatesStep onboardingContext={onboardingContext} />;
			default:
				return null;
		}
	},
	Error: ({ error }) => (
		<div className="flex h-screen items-center justify-center">
			<div className="flex flex-col items-center gap-4 text-center">
				<Text as="h2" variant="headingLg">
					No Bio Site Found
				</Text>
				<Text as="p" variant="bodyMd" tone="subdued">
					Something went wrong ({error.code}). Please try refreshing the page or contact support.
				</Text>
				<ButtonGroup>
					<Button variant="primary" onClick={() => window.location.reload()}>
						Refresh Page
					</Button>
					<Button
						variant="secondary"
						url={`mailto:${appConfig.support.email}`}
						target="_blank"
						external
					>
						Contact Support
					</Button>
				</ButtonGroup>
			</div>
		</div>
	)
});

export default Page;

export const headers: THeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};

// Prevent loader revalidation on URL changes to avoid resetting onboarding state on every step change
export const shouldRevalidate: ShouldRevalidateFunction = () => {
	return false;
};

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ request }) => {
	const { session } = await shopify.authenticate.admin(request);
	const sessionToken = getSessionTokenFromRequest(request);

	// Check if already onboarded
	const workspaceResult = await coreApiClient.get('/v1/shopify/workspace', {
		headers: {
			Authorization: `Bearer ${sessionToken}`
		}
	});
	if (workspaceResult.isOk() && workspaceResult.value.data.onboardingCompletedAt != null) {
		throw redirectWithAuth(request, '/app');
	}

	// Fetch shop overview to customize onboarding experience
	const shopOverviewResult = await coreApiClient.get('/v1/shopify/shop/overview', {
		headers: {
			Authorization: `Bearer ${sessionToken}`
		}
	});
	if (shopOverviewResult.isErr()) {
		return Err({
			code: '#ERR_SERVER_ERROR' as const,
			message: 'Failed to fetch shop overview'
		}).toArray();
	}
	const shopOverview = shopOverviewResult.value.data;

	return Ok({
		shop: session.shop,
		presets: [
			{
				id: 'blank',
				label: 'Blank template',
				content: toFlatSite(
					blankPreset({
						shopId: session.shop,
						name: shopOverview.shop.name,
						profilePicture: shopOverview.theme.logo,
						socialLinks: shopOverview.socialLinks,
						featuredProduct: shopOverview.recommendedProducts?.[0],
						colors: {
							primary: shopOverview.theme.colors.primary,
							background: shopOverview.theme.colors.background,
							surface: '#FFFFFF'
						},
						fonts: {
							heading: { family: shopOverview.theme.typography.headingFont?.family },
							body: { family: shopOverview.theme.typography.bodyFont?.family }
						},
						radius: shopOverview.theme.layout.borderRadius
					})
				)
			}
		]
	}).toArray();
});

interface TSuccessLoaderData {
	shop: string;
	presets: TSitePreset[];
}

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}
