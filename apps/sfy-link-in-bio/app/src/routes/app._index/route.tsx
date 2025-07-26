import { ServerErr, ServerOk } from '@blgc/utils';
import {
	Badge,
	Button,
	ButtonGroup,
	Card,
	Layout,
	Spinner,
	Text,
	TextField
} from '@shopify/polaris';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { useFeatureState } from 'feature-react';
import React from 'react';
import {
	ClipboardButton,
	FeedbackCard,
	GetInTouchCard,
	IframeContent,
	SitePreview,
	ViewIcon
} from '@/components';
import { appConfig, coreApiClient, logger } from '@/environment';
import { shopify, shopifyConfig } from '@/environment/.server';
import { createShopifyTokenMiddleware, resultLoader, withResultLoader } from '@/lib';
import { getSessionTokenFromRequest, redirectWithAuth } from '@/lib/.server';
import { usePageEditorModal } from '@/routes/app.modal.page-editor.$/PageEditorModal';
import { THeadersFunction } from '@/types';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { site, shouldOpenEditor } = data;
		const { Modal: EditorModal, isOpenState: isEditorOpenState } = usePageEditorModal({
			siteId: site.id,
			title: `${site.displayName} (/${site.handle})`
		});
		const isEditorOpen = useFeatureState(isEditorOpenState);
		const [isLoadingEditor, setIsLoadingEditor] = React.useState(shouldOpenEditor);

		// =========================================================================
		// Events
		// =========================================================================

		const handleCustomizeBio = React.useCallback(() => {
			isEditorOpenState.set(true);
		}, [isEditorOpenState]);

		// =========================================================================
		// Effects
		// =========================================================================

		// Auto-open editor if shouldOpenEditor is true
		React.useEffect(() => {
			if (shouldOpenEditor) {
				// Clean up URL first (to not get stuck in a "openEditor=true" loop)
				const url = new URL(window.location.href);
				url.searchParams.delete('openEditor');
				window.history.replaceState({}, '', `${url.pathname}${url.search}`);

				// Open the editor
				isEditorOpenState.set(true);
			}
		}, [shouldOpenEditor, isEditorOpenState]);

		// Stop loading when editor opens
		React.useEffect(() => {
			if (isEditorOpen && isLoadingEditor) {
				setIsLoadingEditor(false);
			}
		}, [isEditorOpen, isLoadingEditor]);

		// =========================================================================
		// UI
		// =========================================================================

		// Show loading state when opening editor from onboarding
		if (isLoadingEditor) {
			return (
				<div className="flex h-screen items-center justify-center">
					<div className="flex flex-col items-center gap-2">
						<Spinner size="small" />
						<Text as="p" variant="bodyMd" tone="subdued">
							Loading Editor
						</Text>
					</div>
				</div>
			);
		}

		return (
			<>
				<EditorModal />

				<s-page>
					<ui-title-bar title="Saku Link In Bio">
						<button variant="primary" onClick={handleCustomizeBio}>
							Customize
						</button>
						<button
							onClick={() => {
								// TitleBar buttons in embedded apps can't use <a> tags - browser blocks them
								// window.open() with noopener,noreferrer bypasses iframe security restrictions
								window.open(site.url, '_blank', 'noopener,noreferrer');
							}}
						>
							Visit
						</button>
					</ui-title-bar>

					<Layout>
						<Layout.Section>
							{/* Bio Preview Card */}
							<Card>
								<SitePreview url={site.url} content={<IframeContent url={site.url} />} />

								{/* Theme List Item */}
								<div className="mt-4 flex items-center justify-between gap-4">
									<div className="flex items-center gap-3">
										{/* Small Thumbnail */}
										<div className="flex h-16 w-24 items-center justify-center rounded-md bg-gray-200 px-3">
											<Text as="span" variant="bodyMd" tone="subdued" truncate>
												/{site.handle}
											</Text>
										</div>

										{/* Content */}
										<div className="flex flex-col items-start gap-1">
											<div className="flex flex-wrap items-center gap-2">
												<Text as="h3" variant="headingMd">
													{site.displayName ?? site.handle}
												</Text>
												<Badge tone="success">Current</Badge>
											</div>
											<Text as="p" variant="bodyMd" tone="subdued">
												Last Updated:{' '}
												{site.updatedAt != null
													? new Date(site.updatedAt).toLocaleDateString()
													: 'Never'}
											</Text>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="flex items-center gap-2">
										<Button
											icon={ViewIcon}
											variant="secondary"
											url={site.url}
											target="_blank"
											accessibilityLabel="Visit your Link In Bio page"
										/>
										<Button variant="primary" onClick={handleCustomizeBio}>
											Customize
										</Button>
									</div>
								</div>
							</Card>
						</Layout.Section>

						<Layout.Section variant="oneThird">
							<div className="flex flex-col gap-5">
								{/* Your Link Card */}
								<Card>
									<div className="flex flex-col gap-3">
										<div className="flex items-center justify-between">
											<Text as="h2" variant="headingMd">
												Your Bio Link
											</Text>
											<Badge tone="success">Current</Badge>
										</div>

										{/* <Text as="p" tone="subdued">
											Hosted on your Shopify store domain.
										</Text> */}

										<TextField
											label=""
											value={site.url}
											readOnly
											autoComplete="off"
											connectedRight={<ClipboardButton textToCopy={site.url} />}
										/>
									</div>
								</Card>
								{/* Your Platform Link Card */}
								{/* <Card>
									<div className="flex flex-col gap-3">
										<div className="flex items-center justify-between">
											<Text as="h2" variant="headingMd">
												Your External Link
											</Text>
											<Badge tone="success">Current</Badge>
										</div>

										<Text as="p" tone="subdued">
											Hosted on an independent domain outside Shopify.
										</Text>

										<TextField
											label=""
											value={platformUrl}
											readOnly
											autoComplete="off"
											connectedRight={<ClipboardButton textToCopy={platformUrl} />}
										/>
									</div>
								</Card> */}
								<FeedbackCard
									email={appConfig.support.email}
									reviewUrl={appConfig.distribution.shopify}
								/>
								<GetInTouchCard
									email={appConfig.support.email}
									discordUrl={appConfig.social.discord}
								/>
							</div>
						</Layout.Section>
					</Layout>
				</s-page>
			</>
		);
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

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ request }) => {
	const { session } = await shopify.authenticate.admin(request);
	const sessionToken = getSessionTokenFromRequest(request);
	const url = new URL(request.url);
	const shouldOpenEditor = url.searchParams.get('openEditor') === 'true';

	if (sessionToken == null) {
		return ServerErr({
			code: '#ERR_UNAUTHORIZED',
			message: 'Unauthorized'
		});
	}

	// 1. Check workspace onboarding status
	const workspaceResult = await coreApiClient.get('/v1/shopify/workspace', {
		requestMiddlewares: [createShopifyTokenMiddleware(sessionToken)]
	});
	if (workspaceResult.isErr()) {
		logger.error('Failed to fetch workspace', workspaceResult.error);
		return ServerErr({
			code: '#ERR_SERVER_ERROR',
			message: 'Failed to fetch workspace data'
		});
	}

	const workspace = workspaceResult.value.data;

	// 2. Check if onboarding is needed
	if (workspace.onboardingCompletedAt == null) {
		throw redirectWithAuth(request, '/app/onboarding');
	}

	// 3. Onboarding complete - fetch sites
	const sitesResult = await coreApiClient.get('/v1/shopify/site', {
		requestMiddlewares: [createShopifyTokenMiddleware(sessionToken)]
	});
	if (sitesResult.isErr()) {
		return ServerErr({
			code: '#ERR_SERVER_ERROR',
			message: 'Failed to fetch site data'
		});
	}

	const site =
		sitesResult.value.data.map((site) => ({
			id: site.id,
			handle: site.handle,
			url: `${shopifyConfig.url(session.shop)}/${site.handle}`,
			proxyUrl: `${shopifyConfig.proxy.url(session.shop)}/${site.handle}`,
			displayName: site.displayName,
			updatedAt: site.updatedAt
		}))[0] ?? null;
	if (site == null) {
		return ServerErr({
			code: '#ERR_NOT_FOUND',
			message: 'No site found'
		});
	}

	return ServerOk({
		site: {
			id: site.id,
			handle: site.handle,
			url: site.url,
			proxyUrl: site.proxyUrl,
			displayName: site.displayName,
			updatedAt: site.updatedAt
		},
		platformUrl: `https://saku.so/w/${workspace.handle}/${site.handle}`,
		shouldOpenEditor
	});
});

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	site: {
		id: string;
		handle: string;
		url: string;
		proxyUrl: string;
		displayName?: string;
		updatedAt: string;
	};
	platformUrl: string;
	shouldOpenEditor: boolean;
}
