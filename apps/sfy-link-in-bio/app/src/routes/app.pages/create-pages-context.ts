import { shortId } from '@blgc/utils';
import { TFlatSite, themes, TTheme } from '@repo/editor';
import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { RequestError } from 'feature-fetch';
import { createState, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { coreApiClient } from '@/environment';
import { applyThemeToSite } from '@/features/page-editor';
import { AppError, createShopifyTokenMiddleware, showShopifyAppErrorToast } from '@/lib';

export function createPagesContext(config: TCreatePagesContextConfig): TPagesContext {
	const { sites, shopify } = config;

	return {
		_shopify: shopify,
		isCreatingSite: createState(false),
		queryValue: createState(''),
		filterName: createState(''),
		filterSlug: createState(''),
		filterStatus: createState<string[]>([]),
		sortSelected: createState(['updated desc']),
		viewTabs: createState(['All']),
		selectedView: createState(0),

		getOldestSiteId() {
			if (!sites.length) {
				return null;
			}

			return sites.reduce((oldest, site) => {
				return new Date(site.createdAt).getTime() < new Date(oldest.createdAt).getTime()
					? site
					: oldest;
			}).id;
		},
		getFilteredSites(options = {}) {
			const {
				queryValue = this.queryValue._v,
				filterName = this.filterName._v,
				filterSlug = this.filterSlug._v,
				filterStatus = this.filterStatus._v,
				sortSelected = this.sortSelected._v
			} = options;
			let filtered = sites;

			// Search query
			if (queryValue.trim() !== '') {
				const query = queryValue.toLowerCase();
				filtered = filtered.filter((site) => {
					const displayName = site.displayName?.toLowerCase() ?? '';
					const handle = site.handle.toLowerCase();
					return displayName.includes(query) || handle.includes(query);
				});
			}

			// Filter by name
			if (filterName.trim() !== '') {
				const query = filterName.toLowerCase();
				filtered = filtered.filter((site) => {
					const displayName = site.displayName?.toLowerCase() ?? '';
					return displayName.includes(query);
				});
			}

			// Filter by slug
			if (filterSlug.trim() !== '') {
				const query = filterSlug.toLowerCase();
				filtered = filtered.filter((site) => site.handle.toLowerCase().includes(query));
			}

			// Filter by status
			if (filterStatus.length > 0) {
				filtered = filtered.filter(() => filterStatus.includes('active'));
			}

			// Sort
			const [sortKey, sortDirection] = sortSelected[0]?.split(' ') ?? ['updated', 'desc'];
			const sorted = [...filtered].sort((a, b) => {
				if (sortKey === 'name') {
					const aName = a.displayName?.toLowerCase() ?? a.handle.toLowerCase();
					const bName = b.displayName?.toLowerCase() ?? b.handle.toLowerCase();
					return sortDirection === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
				}
				if (sortKey === 'slug') {
					return sortDirection === 'asc'
						? a.handle.localeCompare(b.handle)
						: b.handle.localeCompare(a.handle);
				}
				// Default: sort by updated
				const aTime = new Date(a.updatedAt).getTime();
				const bTime = new Date(b.updatedAt).getTime();
				return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
			});

			return sorted;
		},

		clearAllFilters() {
			this.filterName.set('');
			this.filterSlug.set('');
			this.filterStatus.set([]);
		},
		async createView(viewName) {
			this.viewTabs.set((v) => [...v, viewName]);
			this.selectedView.set(this.viewTabs._v.length - 1);
			return true;
		},
		async deleteView(index) {
			const newViewTabs = [...this.viewTabs._v];
			newViewTabs.splice(index, 1);
			this.viewTabs.set(newViewTabs);
			this.selectedView.set(0);
			return true;
		},
		async renameView(index, newName) {
			this.viewTabs.set((v) => v.map((tab, idx) => (idx === index ? newName : tab)));
			return true;
		},
		async duplicateView(viewName) {
			this.viewTabs.set((v) => [...v, viewName]);
			this.selectedView.set(this.viewTabs._v.length - 1);
			return true;
		},

		async createSite() {
			this.isCreatingSite.set(true);

			try {
				const handle = `bio-${sites.length + 1}-${shortId()}`;
				const displayName = `My Bio Page ${sites.length + 1}`;

				// Fetch blank preset
				const [isBlankPresetOk, blankPresetErr, blankPresetResponse] = await coreApiClient.get(
					'/v1/shopify/site/preset/blank',
					{
						requestMiddlewares: [createShopifyTokenMiddleware(this._shopify)]
					}
				);
				if (!isBlankPresetOk) {
					showShopifyAppErrorToast(
						'Failed to create bio page.',
						AppError.fromFetchError(blankPresetErr),
						this._shopify
					);
					return Err('Failed to create bio page.');
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
						requestMiddlewares: [createShopifyTokenMiddleware(this._shopify)]
					}
				);
				if (!isCreateOk) {
					const status = createErr instanceof RequestError ? createErr.status : undefined;
					switch (status) {
						case 409:
							this._shopify.toast.show(`A site with the handle '${handle}' already exists.`, {
								isError: true,
								duration: 5000
							});
							break;
						case 403:
							this._shopify.toast.show(
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
								this._shopify
							);
					}
					return Err('Failed to create bio page.');
				}
				const newSite = createResponse.data;

				return Ok({
					id: newSite.id,
					handle: newSite.handle,
					displayName: newSite.displayName
				});
			} finally {
				this.isCreatingSite.set(false);
			}
		}
	};
}

export interface TCreatePagesContextConfig {
	sites: TTableSite[];
	shopify: ShopifyGlobal;
}

export interface TPagesContext {
	_shopify: ShopifyGlobal;
	isCreatingSite: TState<boolean, []>;
	queryValue: TState<string, []>;
	filterName: TState<string, []>;
	filterSlug: TState<string, []>;
	filterStatus: TState<string[], []>;
	sortSelected: TState<string[], []>;
	viewTabs: TState<string[], []>;
	selectedView: TState<number, []>;

	getOldestSiteId: () => string | null;
	getFilteredSites: (options?: {
		queryValue?: string;
		filterName?: string;
		filterSlug?: string;
		filterStatus?: string[];
		sortSelected?: string[];
	}) => TTableSite[];

	clearAllFilters: () => void;

	createView: (viewName: string) => Promise<boolean>;
	deleteView: (index: number) => Promise<boolean>;
	renameView: (index: number, newName: string) => Promise<boolean>;
	duplicateView: (viewName: string) => Promise<boolean>;

	createSite: () => Promise<
		TResult<
			{
				id: string;
				handle: string;
				displayName?: string;
			},
			string
		>
	>;
}

export interface TTableSite {
	id: string;
	handle: string;
	primaryUrl: string;
	platformUrl: string;
	displayName?: string;
	updatedAt: string;
	createdAt: string;
}
