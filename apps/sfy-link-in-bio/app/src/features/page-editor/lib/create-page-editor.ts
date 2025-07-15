import { deepCopy, shortId } from '@blgc/utils';
import {
	createId,
	getFontHash,
	getFontMetadataByFamily,
	TAsset,
	TAssetHash,
	TAssetId,
	TFont,
	TFontAsset,
	TImageAsset,
	TNode,
	TNodeId,
	TPageNode,
	TSite
} from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { FetchError, NetworkError, RequestError } from 'feature-fetch';
import { createState, TState } from 'feature-state';
import React from 'react';
import { appConfig, coreApiClient } from '@/environment';
import { requestReview } from '@/lib';
import { TSettingsSectionType, TViewType } from '../environment';
import { createNodeState, TNodeState, TNodeStateValue } from './create-node-state';
import { getNodeAssetHashes } from './get-node-asset-hashes';

export function createPageEditor(
	site: TExtendedSite,
	config: TCreatePageEditorConfig
): TPageEditor {
	const { shopify, shopId } = config;

	return {
		id: shortId(),
		site: {
			id: site.id,
			handle: site.handle,
			version: site.version,
			url: site.url
		},

		nodeMap: (() => {
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

			return Object.fromEntries(
				Object.entries(site.nodes).map(([id, node]) => [
					id,
					createNodeState(node, parentMap[id as TNodeId])
				])
			);
		})(),
		rootNodeId: site.rootId,
		selectedNodeId: createState<TNodeId | null>(null),

		assetsMap: site.assets,
		assetsHashMap: Object.values(site.assets).reduce(
			(acc, asset) => {
				if (asset.hash) {
					acc[asset.hash] = asset.id;
				}
				return acc;
			},
			{} as Record<TAssetHash, TAssetId>
		),

		activeView: createState('layers' as TViewType),
		activeSettingsSection: createState<TSettingsSectionType | null>('appearance'),

		isReady: createState(false),
		isDraggingLayer: createState(false),
		shopify,
		shopId,
		boundingRect: createState<TBoundingRect>({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0
		}),
		canvasBoundingRect: createState<TBoundingRect>({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0
		}),

		editorRef: React.createRef<HTMLDivElement>(),
		canvasRef: React.createRef<HTMLDivElement>(),
		canvasContainerRef: React.createRef<HTMLDivElement>(),

		switchView(view) {
			this.activeView.set(view);
			this.unselectNode();
			this.switchSettingsSection('appearance');
		},

		switchSettingsSection(section) {
			this.activeSettingsSection.set(section);
		},

		getRootNode() {
			return this.nodeMap[this.rootNodeId] as TNodeState<TPageNode>;
		},

		addNode(node, parentId, index) {
			const targetParentId = parentId ?? this.rootNodeId;

			// Update existing node
			if (this.nodeMap[node.id] != null) {
				this.nodeMap[node.id]?.set(node);
			}
			// Create new node state with ref
			else {
				this.nodeMap[node.id] = createNodeState(node);
			}

			// Add the node to parent's children at the specified index
			const parentState = this.nodeMap[targetParentId];
			if (parentState != null) {
				parentState.set((v) => {
					// Only add if not already in children
					if ('children' in v && Array.isArray(v.children) && !v.children.includes(node.id)) {
						const children = [...v.children];
						if (index != null && index >= 0 && index <= children.length) {
							// Insert at specified index
							children.splice(index, 0, node.id);
						} else {
							// Append to end if index is not specified or out of bounds
							children.push(node.id);
						}
						return { ...v, children };
					}
					return v;
				});
			}

			return node.id;
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
				if (parentState != null) {
					parentState.set((v) => {
						if ('children' in v && Array.isArray(v.children)) {
							return { ...v, children: v.children.filter((id) => id !== nodeId) };
						}
						return v;
					});
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

		updateNode<GNode extends TNode>(nodeId: TNodeId, updates: Partial<TNodeStateValue<GNode>>) {
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
				const copiedNode = sourceNodeState.toCopiedNode();
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

		registerFontFamily(fontFamily) {
			const fontMetadata = getFontMetadataByFamily(fontFamily);
			if (fontMetadata == null) {
				return null;
			}

			// Skip non-google fonts (like system fonts)
			if (fontMetadata.googleFont == null) {
				return null;
			}

			// Check if font already registered
			const hash = getFontHash(fontMetadata.font);
			const existingAssetId = this.assetsHashMap[hash];
			if (existingAssetId != null) {
				return fontMetadata.font as TFont;
			}

			// Register the font
			const id = createId('asset');
			this.assetsMap[id] = {
				id,
				type: 'font',
				hash,
				contentType: 'font/woff2',
				storage: {
					type: 'url',
					url: `https://fonts.googleapis.com/css2?family=${fontMetadata.googleFont}&display=swap`
				},
				font: fontMetadata.font
			};

			this.assetsHashMap[hash] = id;
			this.loadFont(id);

			return fontMetadata.font as TFont;
		},

		getImageAsset(hash) {
			if (hash == null) {
				return null;
			}

			const asset = this.assetsMap[hash];
			if (asset == null || asset.type !== 'image') {
				return null;
			}

			return asset;
		},

		registerImage(url, fileName, dimensions) {
			const id = createId('asset');

			// Register the image
			this.assetsMap[id] = {
				id,
				type: 'image',
				hash: '', // TODO:
				contentType: 'image/jpeg', // TODO:
				storage: {
					type: 'url',
					url
				},
				dimensions,
				fileName
			};

			return id;
		},

		getFontAsset(hash) {
			if (hash == null) {
				return null;
			}

			const asset = this.assetsMap[hash];
			if (asset == null || asset.type !== 'font') {
				return null;
			}

			return asset;
		},

		loadFont(fontOrId) {
			let id: TAssetId;
			if (typeof fontOrId === 'string') {
				id = fontOrId;
			}
			// Find asset ID by font hash
			else {
				const hash = getFontHash(fontOrId);
				const foundId = this.assetsHashMap[hash];
				if (foundId == null) {
					return; // Font not registered
				}
				id = foundId;
			}

			const asset = this.assetsMap[id];
			if (asset == null || asset.type !== 'font' || asset.storage.type !== 'url') {
				return;
			}

			// Check if already loaded in DOM
			if (document.querySelector(`link[data-font-id="${id}"]`) != null) {
				return;
			}

			// Create and inject CSS link tag
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = asset.storage.url;
			link.setAttribute('data-font-id', id);
			document.head.appendChild(link);
		},

		loadFonts() {
			Object.keys(this.assetsMap).forEach((id) => {
				const asset = this.assetsMap[id as TAssetId];
				if (asset?.type === 'font') {
					this.loadFont(id as TAssetId);
				}
			});
		},

		cleanupAssets() {
			// Get all asset hashes used by nodes
			const usedHashes = Object.values(this.nodeMap).reduce((acc, nodeState) => {
				const node = nodeState._v;
				const hashes = getNodeAssetHashes(node);
				hashes.forEach((hash) => acc.add(hash));
				return acc;
			}, new Set<TAssetHash>());

			// Find unused assets
			const assetsToRemove: TAssetId[] = [];
			Object.keys(this.assetsMap).forEach((id) => {
				if (!usedHashes.has(id)) {
					assetsToRemove.push(id as TAssetId);
				}
			});

			// Remove unused assets
			assetsToRemove.forEach((id) => {
				const asset = this.assetsMap[id];

				// Remove from hash map
				if (asset?.hash != null) {
					delete this.assetsHashMap[asset.hash];
				}

				// Remove from assets map
				delete this.assetsMap[id];

				// Remove from DOM if it's a font
				if (asset?.type === 'font') {
					const linkElement = document.querySelector(`link[data-font-id="${id}"]`);
					if (linkElement != null) {
						linkElement.remove();
					}
				}
			});

			return assetsToRemove;
		},

		async publish() {
			const idToken = await this.shopify.idToken();

			// Clean up unused assets before saving
			this.cleanupAssets();

			const result = await coreApiClient.put(
				'/v1/shopify/site/{siteId}/content',
				{
					content: this.toSite() as any
				},
				{
					pathParams: {
						siteId: this.site.id
					},
					headers: {
						Authorization: `Bearer ${idToken}`
					}
				}
			);

			const isPublished = result.isOk();
			if (isPublished) {
				this.shopify.toast.show('Published', {
					action: 'View site',
					onAction: () => {
						window.open(this.site.url, '_blank');
					}
				});
				await requestReview(this.shopify);
				return true;
			} else {
				const error = result.error;
				const timestamp = new Date().toISOString();

				// Handle network errors
				if (error instanceof NetworkError) {
					this.shopify.toast.show(
						'Network connection issue. Please check your internet and try again.',
						{
							isError: true,
							duration: 5000
						}
					);
					return false;
				}

				// Handle request errors
				if (error instanceof RequestError) {
					switch (error.status) {
						case 429:
							this.shopify.toast.show('Too many requests. Please wait a moment and try again.', {
								isError: true,
								duration: 5000
							});
							return false;
						case 503:
							this.shopify.toast.show(
								'Service is temporarily unavailable. Please try again later.',
								{
									isError: true,
									duration: 5000
								}
							);
							return false;
					}
				}

				// For all other errors, provide detailed error information
				const errorDetails = {
					code: error?.code ?? '#ERR_UNKNOWN',
					message: error?.message ?? 'An unknown error occurred',
					description: error instanceof FetchError ? error.message : undefined,
					throwable: error instanceof FetchError ? error.throwable?.message : undefined
				};
				this.shopify.toast.show('Failed to publish', {
					isError: true,
					action: 'Contact support',
					onAction: () => {
						const subject = encodeURIComponent(`Publishing Error: ${errorDetails.code}`);
						const body = encodeURIComponent(
							`Error details:\nCode: ${errorDetails.code}\nMessage: ${errorDetails.message}\nDescription: ${errorDetails.description ?? 'N/A'}\nThrowable: ${errorDetails.throwable ?? 'N/A'}\nTimestamp: ${timestamp}`
						);
						window.open(
							`mailto:${appConfig.support.email}?subject=${subject}&body=${body}`,
							'_blank'
						);
					}
				});

				return false;
			}
		},

		toSite() {
			return {
				version: this.site.version,
				rootId: this.rootNodeId,
				nodes: Object.values(this.nodeMap).reduce(
					(acc, nodeState) => {
						acc[nodeState.id] = nodeState.toCopiedNode();
						return acc;
					},
					{} as Record<TNodeId, TNode>
				),
				assets: deepCopy(this.assetsMap)
			} satisfies TSite;
		}
	};
}

export interface TCreatePageEditorConfig {
	shopify: ShopifyGlobal;
	shopId: string;
}

export interface TPageEditor {
	id: string;
	site: {
		id: TExtendedSite['id'];
		handle: TExtendedSite['handle'];
		url: TExtendedSite['url'];
		version: TExtendedSite['version'];
	};

	rootNodeId: TNodeId;
	selectedNodeId: TState<TNodeId | null, []>;
	nodeMap: Record<TNodeId, TNodeState>;

	assetsMap: Record<TAssetId, TAsset>;
	assetsHashMap: Record<TAssetHash, TAssetId>;

	activeView: TState<TViewType, []>;
	activeSettingsSection: TState<TSettingsSectionType | null, []>;

	isReady: TState<boolean, []>;
	isDraggingLayer: TState<boolean, []>;
	shopify: ShopifyGlobal;
	shopId: string;
	boundingRect: TState<TBoundingRect, []>;
	canvasBoundingRect: TState<TBoundingRect, []>;

	editorRef: React.RefObject<HTMLDivElement>;
	canvasRef: React.RefObject<HTMLDivElement>;
	canvasContainerRef: React.RefObject<HTMLDivElement>;

	switchView: (view: TViewType) => void;
	switchSettingsSection: (section: TSettingsSectionType | null) => void;

	getRootNode: () => TNodeState<TPageNode>;
	addNode: (node: TNode, parentId?: TNodeId, index?: number) => TNodeId;
	removeNode: (nodeId: TNodeId) => void;
	swapNodes: (nodeId1: TNodeId, nodeId2: TNodeId) => void;
	reorderNode: (nodeId: TNodeId, targetNodeId: TNodeId) => void;
	moveNode: (nodeId: TNodeId, newParentId: TNodeId) => void;
	updateNode: <GNode extends TNode>(
		nodeId: TNodeId,
		updates: Partial<TNodeStateValue<GNode>>
	) => void;
	selectNode: (nodeId: TNodeId) => void;
	unselectNode: () => void;
	copyNode: (nodeId: TNodeId) => TNodeId | null;

	getFontAsset: (id: TAssetId | undefined | null) => TFontAsset | null;
	registerFontFamily: (fontFamily: string) => TFont | null;
	loadFont: (fontOrId: TFont | TAssetId) => void;
	loadFonts: () => void;

	getImageAsset: (id: TAssetId | undefined | null) => TImageAsset | null;
	registerImage: (
		url: string,
		fileName?: string,
		dimensions?: { width: number; height: number }
	) => TAssetHash | null;

	cleanupAssets: () => TAssetHash[];

	publish: () => Promise<boolean>;

	toSite: () => TSite;
}

export interface TBoundingRect {
	left: number;
	top: number;
	bottom: number;
	right: number;
}

export interface TExtendedSite extends TSite {
	id: string;
	handle: string;
	url: string;
}
