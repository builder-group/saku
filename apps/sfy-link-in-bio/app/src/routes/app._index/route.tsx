import { Button, ButtonGroup, Spinner, Text } from '@shopify/polaris';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { useRevalidator, useSearchParams } from 'react-router';
import { Err, Ok, unwrapOrUndefined } from 'tuple-result';
import { AppContext, shopifyConfig } from '@/.server/environment';
import {
	Badge,
	BioUrlSection,
	FeedbackSection,
	IframeContent,
	PlanBadge,
	PolarisViewIcon,
	QuickHelpSection,
	SitePreview,
	usePageEditorModal
} from '@/components';
import { appConfig, coreApiClient } from '@/environment';
import { useCurrentPlan } from '@/hooks';
import { createShopifyTokenMiddleware, resultLoader, withResultLoader } from '@/lib';
import { THeadersFunction } from '@/types';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { site } = data;

		const currentPlan = useCurrentPlan();
		const revalidator = useRevalidator();
		const [searchParams, setSearchParams] = useSearchParams();

		const { cx: pageEditorModalCx, Modal: PageEditorModal } = usePageEditorModal({
			onHide: React.useCallback(() => {
				// Reload loader data to reflect any changes made in the editor
				// (e.g. site handle, display name updates)
				revalidator.revalidate();
			}, [revalidator])
		});

		const isPageEditorOpen = useFeatureState(pageEditorModalCx.isOpen);
		const shouldOpenEditor = React.useMemo(
			() => searchParams.get('openEditor') === 'true',
			[searchParams]
		);
		const [isLoadingEditor, setIsLoadingEditor] = React.useState(shouldOpenEditor);

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
					<ui-title-bar title="Dashboard" />

					<div className="my-4 grid grid-cols-1 gap-4 bg-(--p-color-bg) lg:grid-cols-3">
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
													<Badge tone="magic">Main</Badge>
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

							<div>
								<s-section padding="none">
									<s-clickable
										padding="large"
										href="/app/pages"
										accessibilityLabel="Manage all your bio pages"
									>
										<div className="grid grid-cols-[1fr_auto] items-center gap-4">
											<div>
												<div className="flex items-center gap-2">
													<s-heading>Bio Pages</s-heading>
													{currentPlan.key !== 'awesome' && (
														<PlanBadge plan="awesome" showPlanName={false} />
													)}
												</div>
												<s-paragraph color="subdued">
													Create and manage multiple bio pages for different audiences
												</s-paragraph>
											</div>
											<s-icon type="chevron-right"></s-icon>
										</div>
									</s-clickable>
								</s-section>
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

	const sites: TLoaderDataSite[] = sitesResponse.data
		.map((site) => ({
			id: site.id,
			handle: site.handle,
			primaryUrl:
				primaryUrl != null
					? `${primaryUrl}/${site.handle}`
					: `${shopifyConfig.url(session.shop)}/${site.handle}`,
			platformUrl: `https://saku.so/w/${workspace.handle}/${site.handle}`,
			displayName: site.displayName,
			updatedAt: site.updatedAt,
			createdAt: site.createdAt
		}))
		.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
	if (!sites.length) {
		return Err({
			code: '#ERR_NOT_FOUND' as const,
			message: 'No site found'
		}).toArray();
	}

	return Ok({
		site: sites[0] as TLoaderDataSite
	}).toArray();
});

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	site: TLoaderDataSite;
}

interface TLoaderDataSite {
	id: string;
	handle: string;
	primaryUrl: string;
	platformUrl: string;
	displayName?: string;
	updatedAt: string;
	createdAt: string;
}
