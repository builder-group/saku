import { type LoaderFunction } from '@remix-run/node';
import { useNavigate, useSearchParams } from '@remix-run/react';
import React from 'react';
import { coreApiClient } from '@/environment';
import { shopify } from '@/environment/.server';
import { getSessionTokenFromRequest, redirectWithAuth } from '@/lib/.server';
import {
	ImportLinkpopStep,
	LinkpopPreviewStep,
	SiteCreationOptionsStep,
	TemplatesStep,
	WelcomeStep
} from './components';
import {
	createOnboardingContext,
	type TOnboardingContext,
	type TOnboardingStep
} from './create-onboarding-context';

export default function OnboardingRoute() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const stepParam = React.useMemo(
		() => searchParams.get('step') as TOnboardingStep['type'] | null,
		[searchParams]
	);

	const onboardingContext = React.useMemo<TOnboardingContext>(() => {
		const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
		return createOnboardingContext(appUrl);
	}, []);

	const [stepType, setStepType] = React.useState<TOnboardingStep['type']>('welcome');

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
		case 'site-creation-options':
			return <SiteCreationOptionsStep onboardingContext={onboardingContext} />;
		case 'import-linkpop':
			return <ImportLinkpopStep onboardingContext={onboardingContext} />;
		case 'linkpop-preview':
			return <LinkpopPreviewStep onboardingContext={onboardingContext} />;
		case 'templates':
			return <TemplatesStep onboardingContext={onboardingContext} />;
		default:
			return null;
	}
}

export const loader: LoaderFunction = async ({ request }) => {
	await shopify.authenticate.admin(request);
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

	return null;
};
