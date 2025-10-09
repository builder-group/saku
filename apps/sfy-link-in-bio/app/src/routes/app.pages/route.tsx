import { useAppBridge } from '@shopify/app-bridge-react';
import {
	Badge,
	Button,
	ButtonGroup,
	ChoiceList,
	Icon,
	IndexFilters,
	IndexTable,
	Text,
	TextField,
	useSetIndexFiltersMode,
	type IndexFiltersProps,
	type TabProps
} from '@shopify/polaris';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { useCombinedCompute, useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { useRevalidator } from 'react-router';
import { Err, Ok, unwrapOrUndefined } from 'tuple-result';
import { AppContext, shopifyConfig } from '@/.server/environment';
import {
	PolarisMenuVerticalIcon,
	PolarisPageIcon,
	useDeleteSiteModal,
	usePageEditorModal
} from '@/components';
import { appConfig, coreApiClient } from '@/environment';
import { useCurrentPlan } from '@/hooks';
import { createShopifyTokenMiddleware, resultLoader, withResultLoader } from '@/lib';
import { THeadersFunction } from '@/types';
import { createPagesContext, TTableSite } from './create-pages-context';
import { SiteActionsPopover } from './SiteActionsPopover';

const Page = withResultLoader<TSuccessLoaderData, TErrorLoaderData>({
	Success: ({ data }) => {
		const { sites } = data;

		const revalidator = useRevalidator();
		const currentPlan = useCurrentPlan();
		const shopifyBridge = useAppBridge();

		const { cx: pageEditorModalCx, Modal: PageEditorModal } = usePageEditorModal({
			onHide: React.useCallback(() => {
				revalidator.revalidate();
			}, [revalidator])
		});
		const { cx: deleteSiteModalCx, Modal: DeleteSiteModal } = useDeleteSiteModal({
			onDeleteSuccess: React.useCallback(() => {
				revalidator.revalidate();
			}, [revalidator])
		});

		const cx = React.useMemo(
			() =>
				createPagesContext({
					sites,
					shopify: shopifyBridge
				}),
			[sites, shopifyBridge]
		);

		const { mode, setMode } = useSetIndexFiltersMode();

		const isCreatingSite = useFeatureState(cx.isCreatingSite);
		const queryValue = useFeatureState(cx.queryValue);
		const sortSelected = useFeatureState(cx.sortSelected);
		const selectedView = useFeatureState(cx.selectedView);

		const oldestSiteId = useCompute(cx.queryValue, () => cx.getOldestSiteId(), [cx]);
		const filteredSites = useCombinedCompute(
			[cx.queryValue, cx.filterName, cx.filterSlug, cx.filterStatus, cx.sortSelected],
			([
				{ value: queryValue },
				{ value: filterName },
				{ value: filterSlug },
				{ value: filterStatus },
				{ value: sortSelected }
			]) => cx.getFilteredSites({ queryValue, filterName, filterSlug, filterStatus, sortSelected }),
			[cx]
		);

		const tabs: TabProps[] = useCompute(
			cx.viewTabs,
			({ value }) =>
				value.map((tab, index) => ({
					content: tab,
					index,
					onAction: () => {},
					id: `${tab}-${index}`,
					isLocked: index === 0,
					actions:
						index === 0
							? []
							: [
									{
										type: 'rename',
										onAction: () => {},
										onPrimaryAction: (val) => cx.renameView(index, val)
									},
									{
										type: 'duplicate',
										onPrimaryAction: (viewName) => cx.duplicateView(viewName)
									},
									{
										type: 'delete',
										onPrimaryAction: () => cx.deleteView(index)
									}
								]
				})),
			[cx]
		);
		const filters = useCombinedCompute(
			[cx.filterName, cx.filterSlug, cx.filterStatus],
			([{ value: filterName }, { value: filterSlug }, { value: filterStatus }]) => [
				{
					key: 'name',
					label: 'Name',
					filter: (
						<TextField
							label="Name"
							value={filterName}
							onChange={(value) => cx.filterName.set(value)}
							autoComplete="off"
							labelHidden
						/>
					),
					shortcut: true
				},
				{
					key: 'slug',
					label: 'Slug',
					filter: (
						<TextField
							label="Slug"
							value={filterSlug}
							onChange={(value) => cx.filterSlug.set(value)}
							autoComplete="off"
							labelHidden
						/>
					),
					shortcut: true
				},
				{
					key: 'status',
					label: 'Status',
					filter: (
						<ChoiceList
							title="Status"
							titleHidden
							choices={[{ label: 'Active', value: 'active' }]}
							selected={filterStatus}
							onChange={(value) => cx.filterStatus.set(value)}
							allowMultiple
						/>
					),
					shortcut: true
				}
			],
			[cx]
		);
		const appliedFilters = useCombinedCompute(
			[cx.filterName, cx.filterSlug, cx.filterStatus],
			([{ value: filterName }, { value: filterSlug }, { value: filterStatus }]) => {
				const appliedFilters: IndexFiltersProps['appliedFilters'] = [];
				if (filterName !== '') {
					appliedFilters.push({
						key: 'name',
						label: `Name: ${filterName}`,
						onRemove: () => cx.filterName.set('')
					});
				}
				if (filterSlug !== '') {
					appliedFilters.push({
						key: 'slug',
						label: `Slug: ${filterSlug}`,
						onRemove: () => cx.filterSlug.set('')
					});
				}
				if (filterStatus.length > 0) {
					appliedFilters.push({
						key: 'status',
						label: `Status: Active`,
						onRemove: () => cx.filterStatus.set([])
					});
				}
				return appliedFilters;
			},
			[cx]
		);
		const sortOptions: IndexFiltersProps['sortOptions'] = React.useMemo(
			() => [
				{ label: 'Name', value: 'name asc', directionLabel: 'A-Z' },
				{ label: 'Name', value: 'name desc', directionLabel: 'Z-A' },
				{ label: 'Slug', value: 'slug asc', directionLabel: 'A-Z' },
				{ label: 'Slug', value: 'slug desc', directionLabel: 'Z-A' },
				{ label: 'Updated', value: 'updated asc', directionLabel: 'Oldest first' },
				{ label: 'Updated', value: 'updated desc', directionLabel: 'Newest first' }
			],
			[]
		);

		// =========================================================================
		// Events
		// =========================================================================

		const handleCreateSite = React.useCallback(async () => {
			const [isSiteOk, , site] = await cx.createSite();
			if (isSiteOk) {
				pageEditorModalCx.open(site.id, `${site.displayName} (/${site.handle})`);
			}
		}, [cx, pageEditorModalCx]);

		const handleFiltersClearAll = React.useCallback(() => {
			cx.clearAllFilters();
		}, [cx]);

		const handleCreateNewView = React.useCallback(
			async (viewName: string) => {
				return cx.createView(viewName);
			},
			[cx]
		);

		// =========================================================================
		// UI
		// =========================================================================

		return (
			<>
				<s-page>
					<ui-title-bar title="Saku Link In Bio">
						<button
							variant="primary"
							onClick={handleCreateSite}
							loading={isCreatingSite}
							disabled={isCreatingSite}
						>
							{isCreatingSite ? 'Creating...' : 'Create page'}
						</button>
					</ui-title-bar>

					<div className="my-4 space-y-4 lg:col-span-2">
						{sites.length > 0 ? (
							<s-section padding="none">
								<IndexFilters
									sortOptions={sortOptions}
									sortSelected={sortSelected}
									onSort={(value) => cx.sortSelected.set(value)}
									queryValue={queryValue}
									queryPlaceholder="Search bio pages"
									onQueryChange={(value) => cx.queryValue.set(value)}
									onQueryClear={() => cx.queryValue.set('')}
									tabs={tabs}
									selected={selectedView}
									onSelect={(value) => cx.selectedView.set(value)}
									canCreateNewView
									onCreateNewView={handleCreateNewView}
									filters={filters}
									appliedFilters={appliedFilters}
									onClearAll={handleFiltersClearAll}
									mode={mode}
									setMode={setMode}
								/>

								<IndexTable
									resourceName={{ singular: 'bio page', plural: 'bio pages' }}
									itemCount={filteredSites.length}
									headings={[
										{ title: 'Page Name' },
										{ title: 'Page Slug' },
										{ title: 'Status' },
										{ title: 'Updated' },
										{ title: 'Actions' }
									]}
									selectable={false}
								>
									{filteredSites.map((siteItem, index) => {
										const isMain = siteItem.id === oldestSiteId;

										return (
											<IndexTable.Row
												id={siteItem.id}
												key={siteItem.id}
												position={index}
												onClick={() =>
													pageEditorModalCx.open(
														siteItem.id,
														`${siteItem.displayName} (/${siteItem.handle})`
													)
												}
											>
												<IndexTable.Cell>
													<div className="flex items-center gap-2">
														<Text as="span" variant="bodyMd" fontWeight="semibold">
															{siteItem.displayName ?? siteItem.handle}
														</Text>
														{isMain && <Badge tone="info">Main</Badge>}
													</div>
												</IndexTable.Cell>
												<IndexTable.Cell>
													<Text as="span" variant="bodyMd" tone="subdued">
														/{siteItem.handle}
													</Text>
												</IndexTable.Cell>
												<IndexTable.Cell>
													<Badge tone="success">Active</Badge>
												</IndexTable.Cell>
												<IndexTable.Cell>
													<Text as="span" variant="bodyMd">
														{siteItem.updatedAt != null
															? new Date(siteItem.updatedAt).toLocaleDateString()
															: 'Never'}
													</Text>
												</IndexTable.Cell>
												<IndexTable.Cell>
													<div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
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
												</IndexTable.Cell>
											</IndexTable.Row>
										);
									})}
								</IndexTable>
							</s-section>
						) : (
							<s-section padding="none">
								<div className="flex min-h-64 items-center justify-center">
									<div className="flex max-w-md flex-col items-center gap-4 text-center">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
											<Icon source={PolarisPageIcon} />
										</div>
										<div className="flex flex-col items-center gap-2 text-balance">
											<Text variant="headingMd" as="h3">
												Create your first Bio Page
											</Text>
											<Text variant="bodyMd" tone="subdued" as="p">
												Create bio pages to organize your links and content for different purposes
												or audiences.
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
							</s-section>
						)}
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

	const sites: TTableSite[] = sitesResponse.data
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
		sites
	}).toArray();
});

interface TErrorLoaderData {
	code: `#ERR_${string}`;
	message: string;
}

interface TSuccessLoaderData {
	sites: TTableSite[];
}
