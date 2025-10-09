import { deepCopy, shortId } from '@blgc/utils';
import { TFlatSite, themes, TTheme } from '@repo/editor';
import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { RequestError } from 'feature-fetch';
import { withLocalStorage } from 'feature-react';
import { createState, TPersistFeature, TState } from 'feature-state';
import { Err, Ok, TResult } from 'tuple-result';
import { appConfig, coreApiClient } from '@/environment';
import { applyThemeToSite } from '@/features/page-editor';
import { AppError, createShopifyTokenMiddleware, showShopifyAppErrorToast } from '@/lib';

export function createPagesContext(config: TCreatePagesContextConfig): TPagesContext {
	const { sites, shopify } = config;

	const defaultAllView: TView = {
		name: 'All',
		key: 'all',
		filters: {
			name: '',
			slug: '',
			status: [],
			created: null
		},
		sortSelected: ['created desc']
	};

	return {
		_shopify: shopify,
		_sites: sites,
		isCreatingSite: createState(false),
		queryValue: createState(''),
		filters: createState<TFilters>(defaultAllView.filters),
		sortSelected: createState(defaultAllView.sortSelected),
		viewTabs: withLocalStorage(
			createState<TView[]>([defaultAllView]),
			appConfig.localStorageKey('pages_view-tabs')
		),
		selectedView: createState(0),

		getMainSiteId() {
			if (!this._sites.length) {
				return null;
			}

			return this._sites.reduce((oldest, site) => {
				return new Date(site.createdAt).getTime() < new Date(oldest.createdAt).getTime()
					? site
					: oldest;
			}).id;
		},
		getFilteredSites(options = {}) {
			const {
				queryValue = this.queryValue._v,
				filters = this.filters._v,
				sortSelected = this.sortSelected._v
			} = options;
			let filtered = this._sites;

			// Search query
			if (queryValue.trim().length > 0) {
				const query = queryValue.toLowerCase();
				filtered = filtered.filter((site) => {
					const displayName = site.displayName?.toLowerCase() ?? '';
					const handle = site.handle.toLowerCase();
					return displayName.includes(query) || handle.includes(query);
				});
			}

			// Filter by name
			if (filters.name.trim().length > 0) {
				const query = filters.name.toLowerCase();
				filtered = filtered.filter((site) => {
					const displayName = site.displayName?.toLowerCase() ?? '';
					return displayName.includes(query);
				});
			}

			// Filter by slug
			if (filters.slug.trim().length > 0) {
				const query = filters.slug.toLowerCase();
				filtered = filtered.filter((site) => site.handle.toLowerCase().includes(query));
			}

			// Filter by status
			if (filters.status.length > 0) {
				filtered = filtered.filter(() => filters.status.includes('active'));
			}

			// Filter by created date
			if (filters.created != null) {
				filtered = filtered.filter((site) => {
					const createdTime = new Date(site.createdAt).getTime();
					const startTime =
						filters.created?.start != null ? new Date(filters.created.start).getTime() : 0;
					const endTime =
						filters.created?.end != null ? new Date(filters.created.end).getTime() : Date.now();
					return createdTime >= startTime && createdTime <= endTime;
				});
			}

			// Sort
			const [sortKey, sortDirection] = sortSelected[0]?.split(' ') ?? ['created', 'desc'];
			const sorted = [...filtered].sort((a, b) => {
				switch (sortKey) {
					case 'name': {
						const aName = a.displayName?.toLowerCase() ?? a.handle.toLowerCase();
						const bName = b.displayName?.toLowerCase() ?? b.handle.toLowerCase();
						return sortDirection === 'asc'
							? aName.localeCompare(bName)
							: bName.localeCompare(aName);
					}
					case 'slug': {
						return sortDirection === 'asc'
							? a.handle.localeCompare(b.handle)
							: b.handle.localeCompare(a.handle);
					}
					case 'created': {
						const aTime = new Date(a.createdAt).getTime();
						const bTime = new Date(b.createdAt).getTime();
						return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
					}
					// Default: sort by updated
					default: {
						const aTime = new Date(a.updatedAt).getTime();
						const bTime = new Date(b.updatedAt).getTime();
						return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
					}
				}
			});

			return sorted;
		},

		loadView(index) {
			const view = this.viewTabs._v[index];
			if (view == null) {
				return false;
			}

			this.filters.set({ ...view.filters });
			this.sortSelected.set([...view.sortSelected]);
			return true;
		},
		selectView(index) {
			this.selectedView.set(index);
			return this.loadView(index);
		},
		saveToView(index) {
			const currentView = this.viewTabs._v[index];
			if (currentView == null) {
				return false;
			}

			this.viewTabs._v[index] = {
				...currentView,
				filters: deepCopy(this.filters._v),
				sortSelected: deepCopy(this.sortSelected._v)
			};
			this.viewTabs._notify();
			return true;
		},
		cancelViewUpdate() {
			return this.loadView(this.selectedView._v);
		},
		createView(name, options = {}) {
			const {
				filters = {
					name: '',
					slug: '',
					status: [],
					created: null
				},
				sortSelected = ['updated desc']
			} = options;
			const newView: TView = {
				name,
				key: name.toLowerCase().replace(/\s+/g, '-'),
				filters,
				sortSelected
			};
			this.viewTabs.set((v) => [...v, newView]);
			this.selectView(this.viewTabs._v.length - 1);
			return true;
		},
		deleteView(index) {
			const newViewTabs = [...this.viewTabs._v];
			newViewTabs.splice(index, 1);
			this.viewTabs.set(newViewTabs);
			this.selectView(0);
			return true;
		},
		renameView(index, newName) {
			this.viewTabs.set((v) =>
				v.map((tab, idx) =>
					idx === index
						? {
								...tab,
								name: newName,
								key: newName.toLowerCase().replace(/\s+/g, '-')
							}
						: tab
				)
			);
			return true;
		},
		duplicateView(index, duplicateName) {
			const currentView = this.viewTabs._v[index];
			if (currentView == null) {
				return false;
			}

			const duplicatedView: TView = {
				name: duplicateName,
				key: duplicateName.toLowerCase().replace(/\s+/g, '-'),
				filters: { ...currentView.filters },
				sortSelected: [...currentView.sortSelected]
			};
			this.viewTabs.set((v) => [...v, duplicatedView]);
			this.selectView(this.viewTabs._v.length - 1);
			return true;
		},
		async persistViews() {
			return await this.viewTabs.persist();
		},

		clearFilters() {
			this.filters.set({
				name: '',
				slug: '',
				status: [],
				created: null
			});
		},

		async createSite() {
			this.isCreatingSite.set(true);

			try {
				const handle = `bio-${this._sites.length + 1}-${shortId()}`;
				const displayName = `My Bio Page ${this._sites.length + 1}`;

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
	_sites: TTableSite[];
	isCreatingSite: TState<boolean, []>;
	queryValue: TState<string, []>;
	filters: TState<TFilters, []>;
	sortSelected: TState<string[], []>;
	viewTabs: TState<TView[], [TPersistFeature]>;
	selectedView: TState<number, []>;

	getMainSiteId: () => string | null;
	getFilteredSites: (options?: {
		queryValue?: string;
		filters?: TFilters;
		sortSelected?: string[];
	}) => TTableSite[];

	loadView: (index: number) => boolean;
	selectView: (index: number) => boolean;
	saveToView: (index: number) => boolean;
	cancelViewUpdate: () => boolean;
	createView: (
		viewName: string,
		options?: { filters?: TFilters; sortSelected?: string[] }
	) => boolean;
	deleteView: (index: number) => boolean;
	renameView: (index: number, newName: string) => boolean;
	duplicateView: (index: number, duplicateName: string) => boolean;
	persistViews: () => Promise<boolean>;

	clearFilters: () => void;

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

export interface TDateRange {
	start?: string;
	end?: string;
}

export interface TFilters {
	name: string;
	slug: string;
	status: string[];
	created: TDateRange | null;
}

export interface TView {
	name: string;
	key: string;
	filters: TFilters;
	sortSelected: string[];
}
