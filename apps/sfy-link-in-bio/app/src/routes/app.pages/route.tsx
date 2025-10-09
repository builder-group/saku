import { deepCopy } from '@blgc/utils';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
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
	Badge,
	CrownIcon,
	PolarisMenuHorizontalIcon,
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

		const currentPlan = useCurrentPlan();
		const revalidator = useRevalidator();
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

		const mainSiteId = React.useMemo(() => cx.getMainSiteId(), [cx]);
		const filteredSites = useCombinedCompute(
			[cx.queryValue, cx.filters, cx.sortSelected],
			([{ value: queryValue }, { value: filters }, { value: sortSelected }]) =>
				cx.getFilteredSites({ queryValue, filters, sortSelected }),
			[cx]
		);

		const tabs: TabProps[] = useCompute(
			cx.viewTabs,
			({ value }) =>
				value.map((view, index) => ({
					content: view.name,
					index,
					onAction: () => {},
					id: `${view.key}-${index}`,
					isLocked: index === 0,
					actions:
						index === 0
							? []
							: [
									{
										type: 'rename',
										onAction: () => {},
										onPrimaryAction: async (newName) => cx.renameView(index, newName)
									},
									{
										type: 'duplicate',
										onPrimaryAction: async (duplicateName) => cx.duplicateView(index, duplicateName)
									},
									{
										type: 'delete',
										onPrimaryAction: async () => cx.deleteView(index)
									}
								]
				})),
			[cx]
		);
		const filtersConfig = useCompute(
			cx.filters,
			({ value: currentFilters }) => [
				{
					key: 'name',
					label: 'Name',
					filter: (
						<TextField
							label="Name"
							value={currentFilters.name}
							onChange={(value) => cx.filters.set((f) => ({ ...f, name: value }))}
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
							value={currentFilters.slug}
							onChange={(value) => cx.filters.set((f) => ({ ...f, slug: value }))}
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
							selected={currentFilters.status}
							onChange={(value) => cx.filters.set((f) => ({ ...f, status: value }))}
							allowMultiple
						/>
					),
					shortcut: true
				},
				{
					key: 'created',
					label: 'Created',
					filter: (
						<div className="flex flex-col gap-2">
							<TextField
								label="From"
								type="date"
								value={currentFilters.created?.start ?? ''}
								onChange={(value) =>
									cx.filters.set((f) => ({
										...f,
										created: {
											start: value.length > 0 ? value : undefined,
											end: f.created?.end
										}
									}))
								}
								autoComplete="off"
							/>
							<TextField
								label="To"
								type="date"
								value={currentFilters.created?.end ?? ''}
								onChange={(value) =>
									cx.filters.set((f) => ({
										...f,
										created: {
											start: f.created?.start,
											end: value.length > 0 ? value : undefined
										}
									}))
								}
								autoComplete="off"
							/>
						</div>
					),
					shortcut: true
				}
			],
			[cx]
		);
		const appliedFilters = useCompute(
			cx.filters,
			({ value: currentFilters }) => {
				const appliedFilters: IndexFiltersProps['appliedFilters'] = [];
				if (currentFilters.name !== '') {
					appliedFilters.push({
						key: 'name',
						label: `Name: ${currentFilters.name}`,
						onRemove: () => cx.filters.set((f) => ({ ...f, name: '' }))
					});
				}
				if (currentFilters.slug !== '') {
					appliedFilters.push({
						key: 'slug',
						label: `Slug: ${currentFilters.slug}`,
						onRemove: () => cx.filters.set((f) => ({ ...f, slug: '' }))
					});
				}
				if (currentFilters.status.length > 0) {
					appliedFilters.push({
						key: 'status',
						label: `Status: Active`,
						onRemove: () => cx.filters.set((f) => ({ ...f, status: [] }))
					});
				}
				if (currentFilters.created != null) {
					const label =
						currentFilters.created.start != null && currentFilters.created.end != null
							? `Created: ${currentFilters.created.start} - ${currentFilters.created.end}`
							: currentFilters.created.start != null
								? `Created: From ${currentFilters.created.start}`
								: `Created: Until ${currentFilters.created.end}`;
					appliedFilters.push({
						key: 'created',
						label,
						onRemove: () => cx.filters.set((f) => ({ ...f, created: null }))
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
				{ label: 'Created', value: 'created asc', directionLabel: 'Oldest first' },
				{ label: 'Created', value: 'created desc', directionLabel: 'Newest first' },
				{ label: 'Updated', value: 'updated asc', directionLabel: 'Oldest first' },
				{ label: 'Updated', value: 'updated desc', directionLabel: 'Newest first' }
			],
			[]
		);
		const primaryAction: IndexFiltersProps['primaryAction'] = React.useMemo(() => {
			return selectedView === 0
				? {
						type: 'save-as',
						onAction: async (name) =>
							cx.createView(name, {
								filters: deepCopy(cx.filters._v),
								sortSelected: deepCopy(cx.sortSelected._v)
							}),
						disabled: false,
						loading: false
					}
				: {
						type: 'save',
						onAction: async () => cx.saveToView(selectedView),
						disabled: false,
						loading: false
					};
		}, [cx, selectedView]);
		const cancelAction: IndexFiltersProps['cancelAction'] = React.useMemo(() => {
			return {
				onAction: () => cx.cancelViewUpdate(),
				disabled: false,
				loading: false
			};
		}, [cx]);

		// =========================================================================
		// Events
		// =========================================================================

		const handleCreateSite = React.useCallback(async () => {
			const [isSiteOk, , site] = await cx.createSite();
			if (isSiteOk) {
				pageEditorModalCx.open(site.id, `${site.displayName} (/${site.handle})`);
			}
		}, [cx, pageEditorModalCx]);

		// =========================================================================
		// Effects
		// =========================================================================

		React.useEffect(() => {
			cx.persistViews();
		}, [cx]);

		// =========================================================================
		// UI
		// =========================================================================

		return (
			<>
				<s-page>
					<ui-title-bar title="Pages">
						<button
							variant="primary"
							onClick={handleCreateSite}
							loading={isCreatingSite}
							disabled={isCreatingSite || currentPlan.key !== 'awesome'}
						>
							{isCreatingSite ? 'Creating...' : 'Create page'}
						</button>
					</ui-title-bar>

					<div className="my-4">
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
									onSelect={(index) => cx.selectView(index)}
									canCreateNewView
									onCreateNewView={async (name) => cx.createView(name)}
									filters={filtersConfig}
									appliedFilters={appliedFilters}
									onClearAll={() => cx.clearFilters()}
									primaryAction={primaryAction}
									cancelAction={cancelAction}
									mode={mode}
									setMode={setMode}
								/>
								<IndexTable
									resourceName={{ singular: 'page', plural: 'pages' }}
									itemCount={filteredSites.length}
									headings={[
										{ title: 'Name' },
										{ title: 'Slug' },
										{ title: 'Status' },
										{ title: 'Created' },
										{ title: 'Updated' },
										{ title: 'Actions', alignment: 'center' }
									]}
									selectable={false}
								>
									{filteredSites.map((siteItem, index) => {
										const isMain = siteItem.id === mainSiteId;

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
														{isMain && <Badge tone="magic">Main</Badge>}
													</div>
												</IndexTable.Cell>
												<IndexTable.Cell>
													<Text as="span" variant="bodyMd" tone="subdued">
														/{siteItem.handle}
													</Text>
												</IndexTable.Cell>
												<IndexTable.Cell>
													<s-badge tone="success">Active</s-badge>
												</IndexTable.Cell>
												<IndexTable.Cell>
													<Text as="span" variant="bodyMd">
														{siteItem.createdAt != null
															? new Date(siteItem.createdAt).toLocaleDateString()
															: 'Never'}
													</Text>
												</IndexTable.Cell>
												<IndexTable.Cell>
													<Text as="span" variant="bodyMd">
														{siteItem.updatedAt != null
															? new Date(siteItem.updatedAt).toLocaleDateString()
															: 'Never'}
													</Text>
												</IndexTable.Cell>
												<IndexTable.Cell flush>
													<div
														className="flex items-center justify-center pt-1"
														onClick={(e) => e.stopPropagation()}
													>
														<SiteActionsPopover
															activator={
																<Button
																	icon={PolarisMenuHorizontalIcon}
																	variant="tertiary"
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
											Create page
										</Button>
									</div>
								</div>
							</s-section>
						)}
					</div>

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
										<Text as="h3" variant="headingMd" fontWeight="semibold" alignment="center">
											Multiple Bio Pages
										</Text>
										<Text as="p" variant="bodyMd" tone="subdued" alignment="center">
											Want to create multiple bio pages for different purposes or audiences? Upgrade
											to Awesome plan to unlock unlimited bio pages.
										</Text>
									</div>
									<Button variant="primary" size="medium" url={'/app/settings/plans'}>
										Upgrade to Awesome
									</Button>
								</div>
							</div>
						</div>
					)}
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
