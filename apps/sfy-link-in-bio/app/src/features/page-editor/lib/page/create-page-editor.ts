import { deepCopy, shortId } from '@blgc/utils';
import {
	createId,
	getFontHash,
	getFontMetadataByFamily,
	guessMimeType,
	TAsset,
	TAssetHash,
	TFlatNode,
	TFlatPageNode,
	TFlatSite,
	TFont,
	TFontAsset,
	TImageAsset,
	TIntegration,
	TIntegrationId,
	TNodeId,
	toHierarchical,
	toImageContentType,
	TSite,
	TSiteUrl,
	TToken
} from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { RequestError } from 'feature-fetch';
import { createState, TState } from 'feature-state';
import React from 'react';
import { appConfig, coreApiClient } from '@/environment';
import {
	AppError,
	createShopifyTokenMiddleware,
	getFileNameFromUrl,
	requestReview,
	showShopifyAppErrorToast,
	TBreakpoint
} from '@/lib';
import { TSettingsSectionType, TViewType } from '../../environment';
import { createNodeState, nodeAssetHashRegistry, nodeMetadataRegistry, TNodeState } from '../node';
import { createPageContext, TPageContext } from './create-page-context';

export function createPageEditor(config: TCreatePageEditorConfig): TPageEditor {
	const { site, shopId, shopify } = config;

	return {
		id: shortId(),
		site: {
			id: site.id,
			handle: createState(site.handle),
			displayName: createState(site.displayName),
			version: site.content.version,
			baseUrl: site.baseUrl
		},
		shopId,
		pageContext: createPageContext({
			id: site.id,
			handle: site.handle,
			url: {
				platform: `${site.baseUrl.platform}/${site.handle}`,
				shopify: {
					proxy: `${site.baseUrl.shopify.proxy}/${site.handle}`,
					primary: `${site.baseUrl.shopify.primary}/${site.handle}`
				}
			},
			integrations: Object.values(site.content.integrations),
			trackingEnabled: false
		}),

		nodeMap: (() => {
			const parentMap = Object.values(site.content.nodes).reduce(
				(map, node) => {
					if ('children' in node && node.children) {
						node.children.forEach((childId) => {
							map[childId] = node.id;
						});
					}
					return map;
				},
				{} as Record<TNodeId, TNodeId>
			);

			return Object.fromEntries(
				Object.entries(site.content.nodes).map(([id, node]) => [
					id,
					createNodeState(node, parentMap[id as TNodeId])
				])
			);
		})(),
		rootNodeId: site.content.rootId,
		selectedNodeId: createState<TNodeId | null>(null),
		preSelectedNodeId: createState<TNodeId | null>(null),
		selectedIntegrationId: createState<TIntegrationId | null>(null),

		assetsMap: createState(site.content.assets),
		integrationsMap: createState(site.content.integrations),
		tokenMap: createState(site.content.tokens),

		activeView: createState('layers' as TViewType),
		activeSettingsSection: createState<TSettingsSectionType>('design'),
		activeDesignSettingsTab: createState(0),

		isReady: createState(false),
		isDraggingLayer: createState(false),
		shopify,
		boundingRect: createState<TBoundingRect>({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0
		}),
		breakpoint: createState('base' as TBreakpoint),
		canvasBoundingRect: createState<TBoundingRect>({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0
		}),

		editorRef: React.createRef<HTMLDivElement>(),
		canvasRef: React.createRef<HTMLDivElement>(),
		canvasContainerRef: React.createRef<HTMLIFrameElement>(),

		switchView(view) {
			switch (view.type) {
				case 'settings': {
					this.activeView.set('settings');
					this.switchSettingsView(view.view ?? { type: 'design' });
					break;
				}
				default: {
					this.activeView.set(view.type);
				}
			}
			this.unselectNode();
		},

		switchSettingsView(view) {
			switch (view.type) {
				case 'design': {
					this.activeSettingsSection.set(view.type);
					this.activeDesignSettingsTab.set(view.tab ?? 0);
					break;
				}
				default: {
					this.activeSettingsSection.set(view.type);
				}
			}
		},

		getRootNode() {
			return this.nodeMap[this.rootNodeId] as TNodeState<TFlatPageNode>;
		},

		addNode(node, parentId, index) {
			const targetParentId = parentId ?? this.rootNodeId;

			let nodeState = this.nodeMap[node.id];
			if (nodeState != null) {
				// Update existing node
				nodeState.set(node);
				nodeState.parentId = undefined; // Will be redefined below if (new) parent can have children
			} else {
				// Create new node state
				nodeState = createNodeState(node);
				this.nodeMap[node.id] = nodeState;
			}

			// Add the node to parent's children at the specified index
			const parentState = this.nodeMap[targetParentId];
			if (parentState != null && 'children' in parentState._v) {
				nodeState.parentId = parentState.id;

				if (!parentState._v.children.includes(node.id)) {
					const children = [...parentState._v.children];
					if (index != null && index >= 0 && index <= children.length) {
						// Insert at specified index
						children.splice(index, 0, node.id);
					} else {
						// Append to end if index is not specified or out of bounds
						children.push(node.id);
					}

					parentState._v.children = children;
					parentState._notify();
				}
			}

			return node.id;
		},

		createNode(nodeType, parentId, index) {
			const nodeMetadata = nodeMetadataRegistry[nodeType];
			if (nodeMetadata.internal) {
				return null;
			}

			const nodeId = this.addNode(
				{
					id: createId('node'),
					...deepCopy(nodeMetadata.defaultBundle)
				} as TFlatNode,
				parentId,
				index
			);
			this.selectNode(nodeId);

			return nodeId;
		},

		removeNode(nodeId) {
			if (this.selectedNodeId._v === nodeId) {
				this.unselectNode();
			}

			const node = this.nodeMap[nodeId];
			if (node == null) {
				return;
			}

			// Remove from parent's children
			if (node.parentId != null) {
				const parentState = this.nodeMap[node.parentId];
				if (parentState != null && 'children' in parentState._v) {
					parentState._v.children = parentState._v.children.filter((id) => id !== nodeId);
					parentState._notify();
				}
			}

			// Remove the node itself
			delete this.nodeMap[nodeId];
		},

		swapNodes(nodeId1, nodeId2) {
			const node1 = this.nodeMap[nodeId1];
			const node2 = this.nodeMap[nodeId2];
			if (node1 == null || node2 == null) {
				return;
			}

			// Check if they have the same parent
			if (node1.parentId !== node2.parentId || node1.parentId == null) {
				return;
			}

			const parentState = this.nodeMap[node1.parentId];
			if (parentState == null) {
				return;
			}

			parentState.set((v) => {
				if ('children' in v && Array.isArray(v.children)) {
					const children = [...v.children];
					const index1 = children.indexOf(nodeId1);
					const index2 = children.indexOf(nodeId2);

					if (index1 !== -1 && index2 !== -1) {
						children[index1] = nodeId2;
						children[index2] = nodeId1;
					}

					return { ...v, children };
				}
				return v;
			});
		},

		reorderNode(nodeId, targetNodeId) {
			const node = this.nodeMap[nodeId];
			const targetNode = this.nodeMap[targetNodeId];
			if (node == null || targetNode == null) {
				return;
			}

			// Check if they have the same parent
			if (node.parentId !== targetNode.parentId || node.parentId == null) {
				return;
			}

			const parentState = this.nodeMap[node.parentId];
			if (parentState == null) {
				return;
			}

			parentState.set((v) => {
				if ('children' in v && Array.isArray(v.children)) {
					const children = [...v.children];
					const fromIndex = children.indexOf(nodeId);
					const toIndex = children.indexOf(targetNodeId);

					if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
						children.splice(fromIndex, 1);
						children.splice(toIndex, 0, nodeId);
					}

					return { ...v, children };
				}
				return v;
			});
		},

		moveNode(nodeId, newParentId) {
			const nodeState = this.nodeMap[nodeId];
			const newParentState = this.nodeMap[newParentId];
			if (nodeState == null || newParentState == null) {
				return;
			}

			// Remove from old parent
			if (nodeState.parentId != null) {
				const oldParentState = this.nodeMap[nodeState.parentId];
				if (oldParentState != null) {
					oldParentState.set((v) => {
						if ('children' in v && Array.isArray(v.children)) {
							return { ...v, children: v.children.filter((id) => id !== nodeId) };
						}
						return v;
					});
				}
			}

			// Update node's parentId
			nodeState.parentId = newParentId;

			// Add to new parent
			newParentState.set((v) => {
				if ('children' in v && Array.isArray(v.children)) {
					return { ...v, children: [...v.children, nodeId] };
				}
				return v;
			});
		},

		updateNode<GNode extends TFlatNode>(nodeId: TNodeId, updates: Partial<GNode>) {
			const nodeState = this.nodeMap[nodeId];
			if (nodeState != null) {
				nodeState.set((v) => ({ ...v, ...updates }));
			}
		},

		selectNode(nodeId) {
			if (this.nodeMap[nodeId] != null) {
				this.selectedNodeId.set(nodeId);
				this.activeView.set('layers');
			}
		},

		unselectNode() {
			this.selectedNodeId.set(null);
		},

		preSelectNode(nodeId) {
			if (this.nodeMap[nodeId] != null) {
				this.preSelectedNodeId.set(nodeId);
			}
		},

		unpreSelectNode() {
			this.preSelectedNodeId.set(null);
		},

		copyNode(nodeId) {
			const nodeState = this.nodeMap[nodeId];
			if (nodeState == null || nodeState.parentId == null) {
				return null;
			}

			// Get parent node and find index of to-be-copied node
			const parentNode = this.nodeMap[nodeState.parentId]?._v;
			if (
				parentNode == null ||
				!('children' in parentNode) ||
				!Array.isArray(parentNode.children)
			) {
				return null;
			}
			const nodeIndex = parentNode.children.indexOf(nodeId);
			if (nodeIndex === -1) {
				return null;
			}

			// Recursively copy node and all its children
			const copyNodeRecursive = (
				sourceNodeId: TNodeId,
				parentId: TNodeId,
				index?: number
			): TNodeId | null => {
				const sourceNodeState = this.nodeMap[sourceNodeId];
				if (sourceNodeState == null) {
					return null;
				}

				// Copy the node and assign a new ID
				const copiedNode = sourceNodeState.copied();
				copiedNode.id = createId('node');

				// If the node has children add it and copy children
				if ('children' in copiedNode && Array.isArray(copiedNode.children)) {
					const originalChildren = [...copiedNode.children];
					copiedNode.children = [];

					// First add this node so it exists as a parent for children
					const newNodeId = this.addNode(copiedNode, parentId, index);

					// Then copy all children
					for (const childId of originalChildren) {
						copyNodeRecursive(childId, newNodeId);
					}

					return newNodeId;
				}

				// Node has no children, just add it
				return this.addNode(copiedNode, parentId, index);
			};

			// Copy the entire subtree and insert it right after the original
			return copyNodeRecursive(nodeId, nodeState.parentId, nodeIndex + 1);
		},

		selectIntegration(integrationId) {
			this.selectedIntegrationId.set(integrationId);
			this.activeView.set('settings');
			this.activeSettingsSection.set('integrations');
			this.unselectNode();
		},

		unselectIntegration() {
			this.selectedIntegrationId.set(null);
		},

		addIntegration(type) {
			const existingIntegration = Object.values(this.integrationsMap._v).find((integration) => {
				switch (type) {
					case 'ga4':
					case 'meta-pixel':
						return integration.type === type;
					default:
						return false;
				}
			});
			if (existingIntegration != null) {
				this.selectIntegration(existingIntegration.id);
				return existingIntegration.id;
			}

			const integrationId = createId('integration');
			switch (type) {
				case 'ga4': {
					this.integrationsMap.set({
						...this.integrationsMap._v,
						[integrationId]: {
							id: integrationId,
							type: 'ga4'
						}
					});
					break;
				}
				case 'meta-pixel': {
					this.integrationsMap.set({
						...this.integrationsMap._v,
						[integrationId]: {
							id: integrationId,
							type: 'meta-pixel'
						}
					});
					break;
				}
			}

			this.selectIntegration(integrationId);
			return integrationId;
		},

		removeIntegration(integrationId) {
			const integration = this.integrationsMap._v[integrationId];
			if (integration == null || integration.type === 'shopify') {
				return false;
			}

			const nextIntegrations = { ...this.integrationsMap._v };
			delete nextIntegrations[integrationId];
			this.integrationsMap.set(nextIntegrations);

			if (this.selectedIntegrationId._v === integrationId) {
				this.unselectIntegration();
			}

			return true;
		},

		updateIntegration(integrationId, updater) {
			const integration = this.integrationsMap._v[integrationId];
			if (integration == null) {
				return false;
			}

			this.integrationsMap.set({
				...this.integrationsMap._v,
				[integrationId]: updater(deepCopy(integration))
			});
			return true;
		},

		registerFont(font) {
			const fontMetadata = getFontMetadataByFamily(font.family);
			if (fontMetadata == null) {
				return null;
			}

			// Skip non-google fonts (for now)
			if (fontMetadata.googleFont == null) {
				return null;
			}

			// Check if font already registered
			const hash = getFontHash(font);
			if (this.assetsMap._v[hash] != null) {
				return font;
			}

			// Register the font
			this.assetsMap._v[hash] = {
				id: createId('asset'),
				type: 'font',
				hash,
				contentType: 'font/woff2',
				storage: {
					type: 'url',
					url: `https://fonts.googleapis.com/css2?family=${fontMetadata.googleFont}&display=swap`
				},
				font
			};
			this.assetsMap._notify();

			return font;
		},

		getImageAsset(hash) {
			if (hash == null) {
				return null;
			}

			const asset = this.assetsMap._v[hash];
			if (asset == null || asset.type !== 'image') {
				return null;
			}

			return asset;
		},

		registerImage(url, options = {}) {
			const {
				mimeType = guessMimeType(url),
				fileName = getFileNameFromUrl(url) ?? undefined,
				dimensions
			} = options;
			const assetId = createId('asset');
			const hash = assetId; // Temporary workaround until proper content hashing

			const imageContentType = toImageContentType(mimeType);
			if (imageContentType == null) {
				return null;
			}

			this.assetsMap._v[hash] = {
				id: assetId,
				type: 'image',
				hash,
				contentType: imageContentType,
				storage: {
					type: 'url',
					url
				},
				dimensions,
				fileName
			};
			this.assetsMap._notify();

			return hash;
		},

		getFontAsset(hash) {
			if (hash == null) {
				return null;
			}

			const asset = this.assetsMap._v[hash];
			if (asset == null || asset.type !== 'font') {
				return null;
			}

			return asset;
		},

		cleanupAssets() {
			const usedHashes = new Set<TAssetHash>();

			// Go through all nodes to collect asset hashes
			for (const nodeState of Object.values(this.nodeMap)) {
				(
					nodeAssetHashRegistry[nodeState._v.type] as
						| ((node: TFlatNode) => TAssetHash[])
						| undefined
				)?.(nodeState._v).forEach((hash) => usedHashes.add(hash));
			}

			// Loop through all tokens to collect font hashes
			for (const token of Object.values(this.tokenMap._v)) {
				switch (token.type) {
					case 'font': {
						usedHashes.add(getFontHash(token.value));
						break;
					}
					case 'paint': {
						if (token.value.type === 'image' && token.value.hash != null) {
							usedHashes.add(token.value.hash);
						}
						break;
					}
					default:
					// do nothing
				}
			}

			// Find unused assets
			const assetsToRemove: TAssetHash[] = [];
			Object.keys(this.assetsMap._v).forEach((hash) => {
				if (!usedHashes.has(hash)) {
					assetsToRemove.push(hash as TAssetHash);
				}
			});

			// Remove unused assets
			if (assetsToRemove.length > 0) {
				for (const hash of assetsToRemove) {
					delete this.assetsMap._v[hash];
				}
				this.assetsMap._notify();
			}

			return assetsToRemove;
		},

		isPartnerDevelopment() {
			const shopifyIntegration = Object.values(this.integrationsMap._v).find(
				(integration) => integration.type === 'shopify'
			);
			return shopifyIntegration?.isPartnerDevelopment ?? false;
		},

		isDebug() {
			return this.isPartnerDevelopment() || appConfig.env === 'development';
		},

		async publishSite() {
			// Clean up unused assets before saving
			this.cleanupAssets();

			const [isUpdateOk, updateErr] = await coreApiClient.patch(
				'/v1/shopify/site/{siteId}',
				{
					content: this.toFlatSite() as unknown as Record<string, unknown>
				},
				{
					pathParams: {
						siteId: this.site.id
					},
					requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
				}
			);
			if (!isUpdateOk) {
				showShopifyAppErrorToast(
					'Failed to publish site.',
					AppError.fromFetchError(updateErr),
					this.shopify
				);

				return false;
			}

			this.shopify.toast.show('Published', {
				action: 'View site',
				onAction: () => {
					window.open(this.getSiteUrl(), '_blank');
				}
			});
			await requestReview(this.shopify);
			return true;
		},

		async updateSiteHandle(handle) {
			const [isUpdateOk, updateErr] = await coreApiClient.patch(
				'/v1/shopify/site/{siteId}',
				{ handle },
				{
					pathParams: {
						siteId: this.site.id
					},
					requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
				}
			);
			if (!isUpdateOk) {
				const status = updateErr instanceof RequestError ? updateErr.status : undefined;
				switch (status) {
					case 409:
						this.shopify.toast.show(
							'This handle is already taken. Please choose a different one.',
							{
								isError: true,
								duration: 5000
							}
						);
						break;
					case 400:
						this.shopify.toast.show(
							'Invalid handle format. Use only lowercase letters, numbers, and dashes.',
							{
								isError: true,
								duration: 5000
							}
						);
						break;
					default:
						showShopifyAppErrorToast(
							'Failed to update handle.',
							AppError.fromFetchError(updateErr),
							this.shopify
						);
				}

				return false;
			}

			this.site.handle.set(handle);
			this.shopify.toast.show('Handle updated successfully');
			return true;
		},

		async updateSiteDisplayName(displayName) {
			const [isUpdateOk, updateErr] = await coreApiClient.patch(
				'/v1/shopify/site/{siteId}',
				{ displayName },
				{
					pathParams: {
						siteId: this.site.id
					},
					requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
				}
			);
			if (!isUpdateOk) {
				const status = updateErr instanceof RequestError ? updateErr.status : undefined;
				switch (status) {
					case 400:
						this.shopify.toast.show('Display name is too long. Maximum 32 characters.', {
							isError: true,
							duration: 5000
						});
						break;
					default:
						showShopifyAppErrorToast(
							'Failed to update name.',
							AppError.fromFetchError(updateErr),
							this.shopify
						);
				}

				return false;
			}

			this.site.displayName.set(displayName);
			this.shopify.toast.show('Name updated successfully');
			return true;
		},

		async closeModal() {
			await this.shopify.modal.hide(`editor-modal-${this.site.id}`);
		},

		getSiteUrl() {
			return `${this.site.baseUrl.shopify.primary}/${this.site.handle._v}`;
		},
		getSitePlatformUrl() {
			return `${this.site.baseUrl.platform}/${this.site.handle._v}`;
		},

		overrideWith(site, options = {}) {
			const { keepShopIntegration = true } = options;

			this.site.version = site.version;
			this.rootNodeId = site.rootId;

			// Rebuild node map with new nodes
			const parentMap = Object.values(site.nodes).reduce(
				(map, node) => {
					if ('children' in node && node.children) {
						node.children.forEach((childId) => {
							map[childId] = node.id;
						});
					}
					return map;
				},
				{} as Record<TNodeId, TNodeId>
			);
			this.nodeMap = Object.fromEntries(
				Object.entries(site.nodes).map(([id, node]) => [
					id,
					createNodeState(node, parentMap[id as TNodeId])
				])
			);

			// Override integrations map
			if (keepShopIntegration) {
				const shopIntegration = Object.values(this.integrationsMap._v).find(
					(integration) => integration.type === 'shopify' && integration.shopId === this.shopId
				);
				if (shopIntegration != null) {
					site.integrations[shopIntegration.id] = shopIntegration;
				}
			}
			this.integrationsMap.set(site.integrations);

			// Override assets and tokens maps
			this.assetsMap.set(site.assets);
			this.tokenMap.set(site.tokens);

			this.unselectNode();
			this.unselectIntegration();
		},

		toSite() {
			return toHierarchical(this.toFlatSite());
		},
		toFlatSite() {
			return {
				version: this.site.version,
				rootId: this.rootNodeId,
				nodes: Object.values(this.nodeMap).reduce(
					(acc, nodeState) => {
						acc[nodeState.id] = nodeState.copied();
						return acc;
					},
					{} as Record<TNodeId, TFlatNode>
				),
				assets: deepCopy(this.assetsMap._v),
				integrations: deepCopy(this.integrationsMap._v),
				tokens: deepCopy(this.tokenMap._v)
			} satisfies TFlatSite;
		}
	};
}

export interface TCreatePageEditorConfig {
	site: {
		id: string;
		handle: string;
		displayName?: string;
		baseUrl: TSiteUrl;
		content: TFlatSite;
	};
	shopId: string;
	shopify: ShopifyGlobal;
}

export interface TPageEditor {
	id: string;
	site: {
		id: string;
		version: TFlatSite['version'];
		handle: TState<string, []>;
		displayName: TState<string | undefined, []>;
		baseUrl: TSiteUrl;
	};
	shopId: string;
	pageContext: TPageContext;

	rootNodeId: TNodeId;
	selectedNodeId: TState<TNodeId | null, []>;
	preSelectedNodeId: TState<TNodeId | null, []>;
	selectedIntegrationId: TState<TIntegrationId | null, []>;
	nodeMap: Record<TNodeId, TNodeState>;

	assetsMap: TState<Record<TAssetHash, TAsset>, []>;
	integrationsMap: TState<Record<TIntegrationId, TIntegration>, []>;
	tokenMap: TState<Record<TToken['key'], TToken>, []>;

	activeView: TState<TViewType, []>;
	activeSettingsSection: TState<TSettingsSectionType, []>;
	activeDesignSettingsTab: TState<number, []>;

	isReady: TState<boolean, []>;
	isDraggingLayer: TState<boolean, []>;
	shopify: ShopifyGlobal;
	boundingRect: TState<TBoundingRect, []>;
	breakpoint: TState<TBreakpoint, []>;
	canvasBoundingRect: TState<TBoundingRect, []>;

	editorRef: React.RefObject<HTMLDivElement>;
	canvasRef: React.RefObject<HTMLDivElement>;
	canvasContainerRef: React.RefObject<HTMLIFrameElement>;

	switchView: (view: TSwitchView) => void;
	switchSettingsView: (view: TSwitchSettingsView) => void;

	getRootNode: () => TNodeState<TFlatPageNode>;
	addNode: (node: TFlatNode, parentId?: TNodeId, index?: number) => TNodeId;
	createNode: (nodeType: TFlatNode['type'], parentId?: TNodeId, index?: number) => TNodeId | null;
	removeNode: (nodeId: TNodeId) => void;
	swapNodes: (nodeId1: TNodeId, nodeId2: TNodeId) => void;
	reorderNode: (nodeId: TNodeId, targetNodeId: TNodeId) => void;
	moveNode: (nodeId: TNodeId, newParentId: TNodeId) => void;
	updateNode: <GNode extends TFlatNode>(nodeId: TNodeId, updates: Partial<GNode>) => void;
	selectNode: (nodeId: TNodeId) => void;
	unselectNode: () => void;
	preSelectNode: (nodeId: TNodeId) => void;
	unpreSelectNode: () => void;
	copyNode: (nodeId: TNodeId) => TNodeId | null;

	selectIntegration: (integrationId: TIntegrationId) => void;
	unselectIntegration: () => void;
	addIntegration: (type: 'ga4' | 'meta-pixel') => TIntegrationId;
	removeIntegration: (integrationId: TIntegrationId) => boolean;
	updateIntegration: (
		integrationId: TIntegrationId,
		updater: (integration: TIntegration) => TIntegration
	) => boolean;

	getFontAsset: (hash: TAssetHash | undefined | null) => TFontAsset | null;
	registerFont: (font: TFont) => TFont | null;

	getImageAsset: (hash: TAssetHash | undefined | null) => TImageAsset | null;
	registerImage: (
		url: string,
		options?: {
			mimeType?: string;
			fileName?: string;
			dimensions?: { width: number; height: number };
		}
	) => TAssetHash | null;

	cleanupAssets: () => TAssetHash[];

	isPartnerDevelopment: () => boolean;
	isDebug: () => boolean;

	publishSite: () => Promise<boolean>;
	updateSiteHandle: (handle: string) => Promise<boolean>;
	updateSiteDisplayName: (displayName: string) => Promise<boolean>;

	closeModal: () => Promise<void>;

	getSiteUrl: () => string;
	getSitePlatformUrl: () => string;

	overrideWith: (site: TFlatSite, options?: { keepShopIntegration?: boolean }) => void;

	toSite: () => TSite;
	toFlatSite: () => TFlatSite;
}

export interface TBoundingRect {
	left: number;
	top: number;
	bottom: number;
	right: number;
}

type TSwitchView =
	| {
			type: 'layers' | 'preview';
	  }
	| {
			type: 'settings';
			view?: TSwitchSettingsView;
	  };

type TSwitchSettingsView =
	| {
			type: 'general' | 'metadata' | 'assets' | 'integrations' | 'advanced';
	  }
	| {
			type: 'design';
			tab?: number;
	  };
