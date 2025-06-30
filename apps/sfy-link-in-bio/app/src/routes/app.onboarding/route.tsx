import { type LoaderFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Button } from '@shopify/polaris';
import React from 'react';
import { coreApiClient } from '@/environment';
import { shopify } from '@/environment/.server';
import { kangarooPreset } from '@/features/page-editor';
import { getSessionTokenFromRequest, redirectWithAuth } from '@/lib/.server/shopify';

const Page: React.FC = () => {
	const navigate = useNavigate();
	const shopify = useAppBridge();

	const handleCreateSite = React.useCallback(async () => {
		// Get session token from Shopify App Bridge
		const idToken = await shopify.idToken();

		// Call API to create a new site (use a default handle for now)
		await coreApiClient.post(
			'/v1/shopify/site',
			{
				handle: 'bio',
				displayName: 'My Bio Site',
				content: kangarooPreset as any
			},
			{
				headers: {
					Authorization: `Bearer ${idToken}`
				}
			}
		);

		// API should mark onboarding as complete when site is created
		navigate('/app');
	}, [shopify, navigate]);

	return (
		<div className="flex flex-col items-center gap-6 p-10">
			<h1>Welcome! Let&apos;s get started.</h1>
			<Button variant="primary" onClick={handleCreateSite}>
				Create My First Site
			</Button>
		</div>
	);
};

export default Page;

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
