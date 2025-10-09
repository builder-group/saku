import { shortId } from '@blgc/utils';
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
			if (queryValue.trim() !== '') {
				const query = queryValue.toLowerCase();
				filtered = filtered.filter((site) => {
					const displayName = site.displayName?.toLowerCase() ?? '';
					const handle = site.handle.toLowerCase();
					return displayName.includes(query) || handle.includes(query);
				});
			}

			// Filter by name
			if (filters.name.trim() !== '') {
				const query = filters.name.toLowerCase();
				filtered = filtered.filter((site) => {
					const displayName = site.displayName?.toLowerCase() ?? '';
					return displayName.includes(query);
				});
			}

			// Filter by slug
			if (filters.slug.trim() !== '') {
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
					const startTime = filters.created?.start ? new Date(filters.created.start).getTime() : 0;
					const endTime = filters.created?.end
						? new Date(filters.created.end).getTime()
						: Date.now();
					return createdTime >= startTime && createdTime <= endTime;
				});
			}

			// Sort
			const [sortKey, sortDirection] = sortSelected[0]?.split(' ') ?? ['created', 'desc'];
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
				if (sortKey === 'created') {
					const aTime = new Date(a.createdAt).getTime();
					const bTime = new Date(b.createdAt).getTime();
					return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
				}
				// Default: sort by updated
				const aTime = new Date(a.updatedAt).getTime();
				const bTime = new Date(b.updatedAt).getTime();
				return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
			});

			return sorted;
		},

		saveView() {
			const currentView = this.viewTabs._v[this.selectedView._v];
			if (currentView == null) {
				return;
			}

			this.viewTabs._v[this.selectedView._v] = {
				...currentView,
				filters: { ...this.filters._v },
				sortSelected: [...this.sortSelected._v]
			};
			this.viewTabs._notify();
		},
		loadView(viewIndex: number) {
			const view = this.viewTabs._v[viewIndex];
			if (view == null) {
				return;
			}

			this.filters.set({ ...view.filters });
			this.sortSelected.set([...view.sortSelected]);
		},
		selectView(viewIndex: number) {
			this.selectedView.set(viewIndex);
			this.loadView(viewIndex);
		},
		async createView(viewName) {
			const newView: TView = {
				name: viewName,
				key: viewName.toLowerCase().replace(/\s+/g, '-'),
				filters: {
					name: '',
					slug: '',
					status: [],
					created: null
				},
				sortSelected: ['updated desc']
			};
			this.viewTabs.set((v) => [...v, newView]);
			this.selectView(this.viewTabs._v.length - 1);
			return true;
		},
		async deleteView(index) {
			const newViewTabs = [...this.viewTabs._v];
			newViewTabs.splice(index, 1);
			this.viewTabs.set(newViewTabs);
			this.selectView(0);
			return true;
		},
		async renameView(index, newName) {
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
		async duplicateView(viewName) {
			const currentView = this.viewTabs._v[this.selectedView._v];
			if (currentView == null) {
				return false;
			}

			const duplicatedView: TView = {
				name: viewName,
				key: viewName.toLowerCase().replace(/\s+/g, '-'),
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

	saveView: () => void;
	loadView: (viewIndex: number) => void;
	selectView: (viewIndex: number) => void;
	createView: (viewName: string) => Promise<boolean>;
	deleteView: (index: number) => Promise<boolean>;
	renameView: (index: number, newName: string) => Promise<boolean>;
	duplicateView: (viewName: string) => Promise<boolean>;
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
