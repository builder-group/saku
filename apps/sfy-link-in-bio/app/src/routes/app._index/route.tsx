import { shortId } from '@blgc/utils';
import { TFlatSite, themes, TTheme } from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, ButtonGroup, Icon, Spinner, Text } from '@shopify/polaris';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { RequestError } from 'feature-fetch';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { useRevalidator, useSearchParams } from 'react-router';
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
	useDeleteSiteModal,
	usePageEditorModal
} from '@/components';
import { appConfig, coreApiClient } from '@/environment';
import { applyThemeToSite } from '@/features/page-editor';
import { useCurrentPlan } from '@/hooks';
import {
	AppError,
	cn,
	createShopifyTokenMiddleware,
	resultLoader,
	showShopifyAppErrorToast,
	withResultLoader
} from '@/lib';
import { THeadersFunction } from '@/types';
import { SiteActionsPopover } from './SiteActionsPopover';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { sites } = data;

		const revalidator = useRevalidator();
		const currentPlan = useCurrentPlan();
		const shopifyBridge = useAppBridge();
		const [searchParams, setSearchParams] = useSearchParams();

		const [site, otherSites] = React.useMemo(
			() => [sites[0] as TLoaderDataSite, sites.slice(1)],
			[sites]
		);

		const { cx: pageEditorModalCx, Modal: PageEditorModal } = usePageEditorModal({
			onHide: React.useCallback(() => {
				// Reload loader data to reflect any changes made in the editor
				// (e.g. site handle, display name updates)
				revalidator.revalidate();
			}, [revalidator])
		});
		const { cx: deleteSiteModalCx, Modal: DeleteSiteModal } = useDeleteSiteModal({
			onDeleteSuccess: React.useCallback(() => {
				// Reload loader data to remove the deleted site from the sites list
				revalidator.revalidate();
			}, [revalidator])
		});

		const isPageEditorOpen = useFeatureState(pageEditorModalCx.isOpen);
		const shouldOpenEditor = React.useMemo(
			() => searchParams.get('openEditor') === 'true',
			[searchParams]
		);
		const [isLoadingEditor, setIsLoadingEditor] = React.useState(shouldOpenEditor);
		const [isCreatingSite, setIsCreatingSite] = React.useState(false);

		// =========================================================================
		// Events
		// =========================================================================

		const handleCreateSite = React.useCallback(async () => {
			setIsCreatingSite(true);

			try {
				const handle = `bio-${sites.length + 1}-${shortId()}`;
				const displayName = `My Bio Page ${sites.length + 1}`;

				// Fetch blank preset
				const [isBlankPresetOk, blankPresetErr, blankPresetResponse] = await coreApiClient.get(
					'/v1/shopify/site/preset/blank',
					{
						requestMiddlewares: [createShopifyTokenMiddleware(shopifyBridge)]
					}
				);
				if (!isBlankPresetOk) {
					showShopifyAppErrorToast(
						'Failed to create bio page.',
						AppError.fromFetchError(blankPresetErr),
						shopifyBridge
					);
					return;
				}
				const blankPreset = blankPresetResponse.data;

				const siteContent = applyThemeToSite(
					blankPreset.content as unknown as TFlatSite,
					themes[0] as TTheme
				);

				// Create the site
				const [isCreateOk, createErr, createResponse] = await coreApiClient.post(
					'/v1/shopify/site',
					{
						handle,
						displayName,
						content: siteContent as unknown as Record<string, unknown>,
						createRedirect: true,
						overrideRedirect: false
					},
					{
						requestMiddlewares: [createShopifyTokenMiddleware(shopifyBridge)]
					}
				);
				if (!isCreateOk) {
					const status = createErr instanceof RequestError ? createErr.status : undefined;
					switch (status) {
						case 409:
							shopifyBridge.toast.show(`A site with the handle '${handle}' already exists.`, {
								isError: true,
								duration: 5000
							});
							break;
						case 403:
							shopifyBridge.toast.show(
								'You can only create one site with your current plan. Upgrade to Awesome plan to create multiple sites.',
								{
									isError: true,
									duration: 5000
								}
							);
							break;
						default:
							showShopifyAppErrorToast(
								'Failed to create bio page.',
								AppError.fromFetchError(createErr),
								shopifyBridge
							);
					}
					return;
				}
				const newSite = createResponse.data;

				// Open the modal with the new site
				pageEditorModalCx.open(newSite.id, `${newSite.displayName} (/${newSite.handle})`);
			} finally {
				setIsCreatingSite(false);
			}
		}, [sites.length, shopifyBridge, pageEditorModalCx]);

		// =========================================================================
		// Effects
		// =========================================================================

		// Auto-open editor if shouldOpenEditor is true
		React.useEffect(() => {
			if (shouldOpenEditor) {
				// Clean up URL first (to not get stuck in a "openEditor=true" loop)
				setSearchParams((searchParams) => {
					searchParams.delete('openEditor');
					return searchParams;
				});

				// Open the editor
				pageEditorModalCx.open(site.id, `${site.displayName} (/${site.handle})`);
			}
		}, [shouldOpenEditor, setSearchParams, pageEditorModalCx, site]);

		// Stop loading when editor opens
		React.useEffect(() => {
			if (isPageEditorOpen && isLoadingEditor) {
				setIsLoadingEditor(false);
			}
		}, [isPageEditorOpen, isLoadingEditor]);

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
											<Button
												variant="primary"
												onClick={() =>
													pageEditorModalCx.open(site.id, `${site.displayName} (/${site.handle})`)
												}
											>
												Customize
											</Button>
										</div>
									</div>
								</s-section>
							</div>

							{/* Bio Pages List Section */}
							<div className="relative">
								<s-section padding="none">
									<div className="flex items-center justify-between p-4">
										<Text as="h2" variant="headingMd">
											Bio Pages
										</Text>
										{otherSites.length > 0 && (
											<Button
												variant="primary"
												onClick={handleCreateSite}
												loading={isCreatingSite}
												disabled={isCreatingSite}
											>
												New
											</Button>
										)}
									</div>

									{otherSites.length > 0 ? (
										<div className={cn(currentPlan.key !== 'awesome' && 'min-h-64')}>
											{otherSites.map((siteItem, index) => (
												<div key={siteItem.id}>
													<div
														className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
														onClick={() =>
															pageEditorModalCx.open(
																siteItem.id,
																`${siteItem.displayName} (/${siteItem.handle})`
															)
														}
													>
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
														<div onClick={(e) => e.stopPropagation()}>
															<SiteActionsPopover
																activator={
																	<Button
																		icon={PolarisMenuVerticalIcon}
																		variant="plain"
																		accessibilityLabel="Bio page actions"
																	/>
																}
																site={siteItem}
																onCustomize={() =>
																	pageEditorModalCx.open(
																		siteItem.id,
																		`${siteItem.displayName} (/${siteItem.handle})`
																	)
																}
																onRemove={() => deleteSiteModalCx.open(siteItem.id)}
															/>
														</div>
													</div>
													{index < otherSites.length - 1 && (
														<div className="border-b border-gray-200" />
													)}
												</div>
											))}
										</div>
									) : (
										<div className="flex min-h-64 items-center justify-center">
											<div className="flex max-w-md flex-col items-center gap-4 text-center">
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
													onClick={handleCreateSite}
													loading={isCreatingSite}
													disabled={isCreatingSite}
												>
													Create Bio Page
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
				<DeleteSiteModal />
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

export const loader = resultLoader<TSuccessLoaderData, TErrorLoaderData>(async ({ context }) => {
	const {
		workspace,
		shopify: {
			sessionToken,
			admin: { session }
		}
	} = context.get(AppContext);

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
		sites
	}).toArray();
});

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	sites: TLoaderDataSite[];
}

interface TLoaderDataSite {
	id: string;
	handle: string;
	primaryUrl: string;
	platformUrl: string;
	displayName?: string;
	updatedAt: string;
}
