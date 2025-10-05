import { Button, ButtonGroup, Layout, Spinner, Text } from '@shopify/polaris';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { Err, Ok, unwrapOrUndefined } from 'tuple-result';
import { AppContext, shopifyConfig } from '@/.server/environment';
import {
	BioUrlSection,
	FeedbackSection,
	IframeContent,
	PolarisViewIcon,
	QuickHelpSection,
	SitePreview,
	usePageEditorModal
} from '@/components';
import { appConfig, coreApiClient } from '@/environment';
import { createShopifyTokenMiddleware, resultLoader, withResultLoader } from '@/lib';
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
				<s-page>
					<ui-title-bar title="Saku Link In Bio">
						{/* <button variant="primary" onClick={handleCustomizeBio}>
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
						</button> */}
					</ui-title-bar>
					<div className="h-4" />

					<Layout>
						<Layout.Section>
							{/* Bio Preview Section */}
							<s-section>
								<SitePreview
									url={site.primaryUrl}
									content={<IframeContent url={site.platformUrl} disableScroll={true} />}
								/>

								{/* Theme List Item */}
								<div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
									<div className="flex items-center gap-3">
										{/* Small Thumbnail */}
										<div className="flex h-16 w-24 items-center justify-center rounded-md bg-neutral-200 px-3">
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
												<s-badge tone="success">Current</s-badge>
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
											icon={PolarisViewIcon}
											variant="secondary"
											url={site.primaryUrl}
											target="_blank"
											accessibilityLabel="Visit your Link In Bio page"
										/>
										<Button variant="primary" onClick={handleCustomizeBio}>
											Customize
										</Button>
									</div>
								</div>
							</s-section>
						</Layout.Section>

						<Layout.Section variant="oneThird">
							<div className="flex flex-col gap-5">
								<BioUrlSection
									primaryUrl={site.primaryUrl}
									platformUrl={site.platformUrl}
									title="Your Bio Link"
								/>
								<FeedbackSection
									email={appConfig.help.email}
									reviewUrl={appConfig.distribution.shopify}
								/>
								<QuickHelpSection />
							</div>
						</Layout.Section>
					</Layout>
				</s-page>

				<EditorModal />
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
						url={`mailto:${appConfig.help.email}`}
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

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(
	async ({ request, context }) => {
		const {
			workspace,
			shopify: {
				sessionToken,
				admin: { session }
			}
		} = context.get(AppContext);

		const url = new URL(request.url);
		const shouldOpenEditor = url.searchParams.get('openEditor') === 'true';

		// Get sites
		const [isSitesOk, , sitesResponse] = await coreApiClient.get('/v1/shopify/site', {
			requestMiddlewares: [createShopifyTokenMiddleware(sessionToken)]
		});
		if (!isSitesOk) {
			return Err({
				code: '#ERR_SERVER_ERROR' as const,
				message: 'Failed to fetch site data'
			}).toArray();
		}

		// Get shop primary URL
		const primaryUrlResponse = unwrapOrUndefined(
			await coreApiClient.get('/v1/shopify/shop/primary-url', {
				requestMiddlewares: [createShopifyTokenMiddleware(sessionToken)]
			})
		);
		const primaryUrl = primaryUrlResponse?.data.primaryDomain?.url;

		const site =
			sitesResponse.data.map((site) => ({
				id: site.id,
				handle: site.handle,
				primaryUrl:
					primaryUrl != null
						? `${primaryUrl}/${site.handle}`
						: `${shopifyConfig.url(session.shop)}/${site.handle}`,
				platformUrl: `https://saku.so/w/${workspace.handle}/${site.handle}`,
				displayName: site.displayName,
				updatedAt: site.updatedAt
			}))[0] ?? null;
		if (site == null) {
			return Err({
				code: '#ERR_NOT_FOUND' as const,
				message: 'No site found'
			}).toArray();
		}

		return Ok({
			site,
			shouldOpenEditor
		}).toArray();
	}
);

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	site: {
		id: string;
		handle: string;
		primaryUrl: string;
		platformUrl: string;
		displayName?: string;
		updatedAt: string;
	};
	shouldOpenEditor: boolean;
}
