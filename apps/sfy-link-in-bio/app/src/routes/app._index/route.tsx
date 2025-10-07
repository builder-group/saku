import { shortId } from '@blgc/utils';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, ButtonGroup, Icon, Spinner, Text } from '@shopify/polaris';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { Err, Ok, unwrapOrUndefined } from 'tuple-result';
import { AppContext, shopifyConfig } from '@/.server/environment';
import {
	BioUrlSection,
	CrownIcon,
	FeedbackSection,
	IframeContent,
	PolarisMenuVerticalIcon,
	PolarisPageIcon,
	PolarisViewIcon,
	QuickHelpSection,
	SitePreview,
	usePageEditorModal
} from '@/components';
import { appConfig, coreApiClient } from '@/environment';
import { useCurrentPlan } from '@/hooks';
import { createShopifyTokenMiddleware, resultLoader, withResultLoader } from '@/lib';
import { THeadersFunction } from '@/types';
import { SiteActionsPopover } from './SiteActionsPopover';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { sites, shouldOpenEditor } = data;
		const currentPlan = useCurrentPlan();
		const shopifyBridge = useAppBridge();

		const [site, otherSites] = React.useMemo(
			() => [sites[0] as TLoaderDataSite, sites.slice(1)],
			[sites]
		);
		const { Modal: PageEditorModal, isOpenState: isEditorOpenState } = usePageEditorModal({
			siteId: site.id,
			title: `${site.displayName} (/${site.handle})`
		});
		const isEditorOpen = useFeatureState(isEditorOpenState);
		const [isLoadingEditor, setIsLoadingEditor] = React.useState(shouldOpenEditor);
		const [isCreatingBio, setIsCreatingBio] = React.useState(false);

		// =========================================================================
		// Events
		// =========================================================================

		const handleCustomizeBio = React.useCallback(() => {
			isEditorOpenState.set(true);
		}, [isEditorOpenState]);

		const handleCreateBioPage = React.useCallback(async () => {
			setIsCreatingBio(true);

			try {
				const handle = `bio-${sites.length + 1}-${shortId()}`;
				const displayName = `My Bio Page ${sites.length + 1}`;

				// Fetch blank preset
				const [isBlankPresetOk, , blankPresetResponse] = await coreApiClient.get(
					'/v1/shopify/site/preset/blank',
					{
						requestMiddlewares: [createShopifyTokenMiddleware(shopifyBridge)]
					}
				);
				if (!isBlankPresetOk) {
					// TODO:
					return;
				}
				const blankPreset = blankPresetResponse.data;

				// Create the site
				const [isCreateOk, , createResponse] = await coreApiClient.post(
					'/v1/shopify/site',
					{
						handle,
						displayName,
						content: blankPreset.content,
						createRedirect: true,
						overrideRedirect: false
					},
					{
						requestMiddlewares: [createShopifyTokenMiddleware(shopifyBridge)]
					}
				);
				if (!isCreateOk) {
					// TODO:
					return;
				}
				const newSite = createResponse.data;

				// TODO:
			} finally {
				setIsCreatingBio(false);
			}
		}, [sites.length, shopifyBridge]);

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

		// Show loading state when opening editor (e.g. from onboarding)
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
					<ui-title-bar title="Saku Link In Bio" />

					<div className="my-4 grid grid-cols-1 gap-4 bg-[var(--p-color-bg)] lg:grid-cols-3">
						<div className="space-y-4 lg:col-span-2">
							{/* Bio Preview Section */}
							<div>
								<s-section>
									<SitePreview
										url={site.primaryUrl}
										content={<IframeContent url={site.platformUrl} disableScroll={true} />}
									/>
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
													<s-badge tone="success">Main</s-badge>
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
							</div>

							{/* Bio Pages List Section */}
							<div className="relative">
								<s-section>
									<div className="mb-4 flex items-center justify-between">
										<Text as="h2" variant="headingMd">
											Bio Pages
										</Text>
										{otherSites.length > 0 && (
											<Button
												variant="primary"
												onClick={handleCreateBioPage}
												loading={isCreatingBio}
												disabled={isCreatingBio}
											>
												{isCreatingBio ? 'Creating...' : 'New'}
											</Button>
										)}
									</div>

									{otherSites.length > 0 ? (
										<div>
											{otherSites.map((siteItem, index) => (
												<div key={siteItem.id}>
													<div className="flex items-center gap-3 py-3 pr-3">
														{/* Small Thumbnail */}
														<div className="flex h-16 w-24 items-center justify-center rounded-md bg-neutral-200 px-3">
															<Text as="span" variant="bodyMd" tone="subdued" truncate>
																/{siteItem.handle}
															</Text>
														</div>

														{/* Content */}
														<div className="flex flex-1 flex-col items-start gap-1">
															<Text as="h3" variant="headingMd">
																{siteItem.displayName ?? siteItem.handle}
															</Text>
															<Text as="p" variant="bodyMd" tone="subdued">
																Last Updated:{' '}
																{siteItem.updatedAt != null
																	? new Date(siteItem.updatedAt).toLocaleDateString()
																	: 'Never'}
															</Text>
														</div>

														{/* Action Popover */}
														<SiteActionsPopover
															activator={
																<Button
																	icon={PolarisMenuVerticalIcon}
																	variant="plain"
																	accessibilityLabel="Bio page actions"
																/>
															}
															site={siteItem}
															onCustomize={handleCustomizeBio}
														/>
													</div>
													{index < sites.length - 1 && <div className="border-b border-gray-200" />}
												</div>
											))}
										</div>
									) : (
										<div className="flex h-64 items-center justify-center">
											<div className="flex flex-col items-center gap-4 text-center">
												<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
													<Icon source={PolarisPageIcon} />
												</div>
												<div className="flex flex-col items-center gap-2 text-balance">
													<Text variant="headingMd" as="h3">
														Create additional Bio Page
													</Text>
													<Text variant="bodyMd" tone="subdued" as="p">
														Create additional bio pages to organize your links and content for
														different purposes or audiences.
													</Text>
												</div>
												<Button
													variant="primary"
													onClick={handleCreateBioPage}
													loading={isCreatingBio}
													disabled={isCreatingBio}
												>
													{isCreatingBio ? 'Creating...' : 'Create Bio Page'}
												</Button>
											</div>
										</div>
									)}
								</s-section>

								{/* Upgrade Overlay */}
								{currentPlan.key !== 'awesome' && (
									<div className="absolute inset-0 z-50 flex h-full items-center justify-center overflow-hidden rounded-xl">
										<div
											className="absolute inset-0"
											style={{
												background:
													'linear-gradient(to bottom, transparent 0%, rgba(230,247,255,0.4) 20%, rgba(242,230,255,0.6) 40%, rgba(255,230,240,0.8) 60%, rgba(255,230,240,0.95) 100%)'
											}}
										/>
										<div className="relative z-10 mx-8 max-w-sm text-center">
											<div className="flex flex-col items-center gap-4 rounded-lg bg-white/20 p-6 text-balance backdrop-blur-sm">
												<CrownIcon className="h-6 w-6" />
												<div className="flex flex-col items-center gap-2">
													<Text
														as="h3"
														variant="headingMd"
														fontWeight="semibold"
														alignment="center"
													>
														Multiple Bio Pages
													</Text>
													<Text as="p" variant="bodyMd" tone="subdued" alignment="center">
														Want to create multiple bio pages for different purposes or audiences?
														Upgrade to Awesome plan to unlock unlimited bio pages.
													</Text>
												</div>
												<Button variant="primary" size="medium" url={'/app/settings/plans'}>
													Upgrade to Awesome
												</Button>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<BioUrlSection
									primaryUrl={site.primaryUrl}
									platformUrl={site.platformUrl}
									title="Your Bio Link"
								/>
							</div>
							<div>
								<FeedbackSection
									email={appConfig.help.email}
									reviewUrl={appConfig.distribution.shopify}
								/>
							</div>
							<div>
								<QuickHelpSection />
							</div>
						</div>
					</div>
				</s-page>

				<PageEditorModal />
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

		const sites: TLoaderDataSite[] = sitesResponse.data.map((site) => ({
			id: site.id,
			handle: site.handle,
			primaryUrl:
				primaryUrl != null
					? `${primaryUrl}/${site.handle}`
					: `${shopifyConfig.url(session.shop)}/${site.handle}`,
			platformUrl: `https://saku.so/w/${workspace.handle}/${site.handle}`,
			displayName: site.displayName,
			updatedAt: site.updatedAt
		}));
		if (!sites.length) {
			return Err({
				code: '#ERR_NOT_FOUND' as const,
				message: 'No site found'
			}).toArray();
		}

		return Ok({
			sites,
			shouldOpenEditor
		}).toArray();
	}
);

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	sites: TLoaderDataSite[];
	shouldOpenEditor: boolean;
}

interface TLoaderDataSite {
	id: string;
	handle: string;
	primaryUrl: string;
	platformUrl: string;
	displayName?: string;
	updatedAt: string;
}
