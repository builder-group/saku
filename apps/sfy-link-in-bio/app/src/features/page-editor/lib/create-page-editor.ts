import { deepCopy, shortId } from '@blgc/utils';
import {
	getFontHash,
	getFontMetadataByFamily,
	TAsset,
	TAssetHash,
	TFont,
	TFontAsset,
	TImageAsset,
	TNode,
	TNodeId,
	TPageNode,
	TSite
} from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import React from 'react';
import { coreApiClient } from '@/environment';
import { TSettingsSectionType, TViewType } from '../environment';
import { createNodeState, TNodeState } from './create-node-state';
import { flattenNode, TFlattenedNode, unflattenNode } from './flatten-node';
import { getNodeAssetHashes } from './get-node-asset-hashes';

export function createPageEditor(
	site: TSite,
	siteUrl: string,
	shopify: ShopifyGlobal
): TPageEditor {
	return {
		id: shortId(),
		site: {
			id: site.id,
			version: site.version,
			url: siteUrl
		},

		nodeMap: flattenNode(site.root, (node) => createNodeState(node)),
		rootNodeId: site.root.id,
		selectedNodeId: createState<TNodeId | null>(null),

		assetsMap: site.assets.reduce(
			(map, asset) => {
				map[asset.hash] = asset;
				return map;
			},
			{} as Record<TAssetHash, TAsset>
		),

		activeView: createState('layers' as TViewType),
		activeSettingsSection: createState<TSettingsSectionType | null>('appearance'),

		isReady: createState(false),
		isDraggingLayer: createState(false),
		shopify,
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
			return this.nodeMap[this.rootNodeId] as TState<TFlattenedNode<TPageNode>, []>;
		},

		addNode(node, parentId, index) {
			const targetParentId = parentId ?? this.rootNodeId;

			// Flatten the entire node subtree with correct parentId for root
			const flattenedSubtree = flattenNode(node, (flatNode) => {
				// Set correct parentId for the root node being added
				return flatNode.id === node.id ? { ...flatNode, parentId: targetParentId } : flatNode;
			});

			// Add or update all nodes in the subtree
			Object.entries(flattenedSubtree).forEach(([nodeId, flatNode]) => {
				// Update existing node
				if (this.nodeMap[nodeId] != null) {
					this.nodeMap[nodeId]?.set(flatNode);
				}
				// Create new node state with ref
				else {
					this.nodeMap[nodeId] = createNodeState(flatNode);
				}
			});

			// Add the root node to parent's children at the specified index
			const parentState = this.nodeMap[targetParentId];
			if (parentState != null) {
				parentState.set((v) => {
					if ('children' in v) {
						// Only add if not already in children
						if (!v.children.includes(node.id)) {
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

			const node = this.nodeMap[nodeId]?._v;
			if (node == null) {
				return;
			}

			// Remove from parent's children using parentId
			if (node.parentId != null) {
				const parentState = this.nodeMap[node.parentId];
				if (parentState != null) {
					parentState.set((v) => {
						if ('children' in v) {
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
			const node1 = this.nodeMap[nodeId1]?._v;
			const node2 = this.nodeMap[nodeId2]?._v;
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
				if ('children' in v) {
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
			const node = this.nodeMap[nodeId]?._v;
			const targetNode = this.nodeMap[targetNodeId]?._v;
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
				if ('children' in v) {
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

			const node = nodeState._v;
			const oldParentId = node.parentId;

			// Remove from old parent
			if (oldParentId != null) {
				const oldParentState = this.nodeMap[oldParentId];
				if (oldParentState != null) {
					oldParentState.set((v) => {
						if ('children' in v) {
							return { ...v, children: v.children.filter((id) => id !== nodeId) };
						}
						return v;
					});
				}
			}

			// Update node's parentId
			nodeState.set((v) => ({ ...v, parentId: newParentId }));

			// Add to new parent
			newParentState.set((v) => {
				if ('children' in v) {
					return { ...v, children: [...v.children, nodeId] };
				}
				return v;
			});
		},

		updateNode<GNode extends TFlattenedNode<TNode>>(nodeId: TNodeId, updates: Partial<GNode>) {
			const nodeState = this.nodeMap[nodeId];
			if (nodeState != null) {
				nodeState.set((v) => ({ ...v, ...updates }) as TFlattenedNode<TNode>);
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
			const node = this.nodeMap[nodeId]?._v;
			if (node == null || node.parentId == null) {
				return null;
			}

			// Get parent node and find index of original node
			const parentState = this.nodeMap[node.parentId];
			if (parentState == null || !('children' in parentState._v)) {
				return null;
			}
			const parentNode = parentState._v;
			const nodeIndex = parentNode.children.indexOf(nodeId);
			if (nodeIndex === -1) {
				return null;
			}

			// Unflatten the node and its subtree
			const originalNode = unflattenNode(this.nodeMap, nodeId, (state) => state._v) as TNode;

			// Create new IDs for all nodes in the subtree
			function replaceIds(node: TNode): TNode {
				node.id = shortId();
				if ('children' in node) {
					node.children = node.children.map(replaceIds);
				}
				return node;
			}

			const copiedNode = replaceIds(deepCopy(originalNode));

			// Add the copied node right after the original node
			return this.addNode(copiedNode, node.parentId, nodeIndex + 1);
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
			if (this.assetsMap[hash] != null) {
				return fontMetadata.font as TFont;
			}

			// Register the font
			this.assetsMap[hash] = {
				type: 'font',
				contentType: 'font/woff2',
				storage: {
					type: 'url',
					url: `https://fonts.googleapis.com/css2?family=${fontMetadata.googleFont}&display=swap`
				},
				font: fontMetadata.font,
				hash
			};

			this.loadFont(hash);

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
			const hash = shortId(); // TODO: use proper content hash

			// Check if image already registered
			if (this.assetsMap[hash] != null) {
				return hash;
			}

			// Register the image
			this.assetsMap[hash] = {
				type: 'image',
				contentType: 'image/jpeg', // TODO:
				storage: {
					type: 'url',
					url
				},
				dimensions,
				fileName,
				hash
			};

			return hash;
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

		loadFont(fontOrHash) {
			const hash = typeof fontOrHash === 'string' ? fontOrHash : getFontHash(fontOrHash);
			const asset = this.assetsMap[hash];
			if (asset == null || asset.type !== 'font' || asset.storage.type !== 'url') {
				return;
			}

			// Check if already loaded in DOM
			if (document.querySelector(`link[data-font-id="${hash}"]`) != null) {
				return;
			}

			// Create and inject CSS link tag
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = asset.storage.url;
			link.setAttribute('data-font-id', hash);
			document.head.appendChild(link);
		},

		loadFonts() {
			Object.keys(this.assetsMap).forEach((hash) => {
				const asset = this.assetsMap[hash];
				if (asset?.type === 'font') {
					this.loadFont(hash);
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
			const assetsToRemove: TAssetHash[] = [];
			Object.keys(this.assetsMap).forEach((hash) => {
				if (!usedHashes.has(hash)) {
					assetsToRemove.push(hash);
				}
			});

			// Remove unused assets
			assetsToRemove.forEach((hash) => {
				const asset = this.assetsMap[hash];

				// Remove from assets map
				delete this.assetsMap[hash];

				// Remove from DOM if it's a font
				if (asset?.type === 'font') {
					const linkElement = document.querySelector(`link[data-font-id="${hash}"]`);
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

			return result.isOk();
		},

		toSite() {
			return {
				id: this.site.id,
				version: this.site.version,
				root: unflattenNode(this.nodeMap, this.rootNodeId, (state) => state._v) as TPageNode,
				assets: Object.values(this.assetsMap)
			} satisfies TSite;
		}
	};
}

export interface TPageEditor {
	id: string;
	site: {
		id: TSite['id'];
		version: TSite['version'];
		url: string;
	};

	rootNodeId: TNodeId;
	selectedNodeId: TState<TNodeId | null, []>;
	nodeMap: Record<TNodeId, TNodeState>;

	assetsMap: Record<TAssetHash, TAsset>;

	activeView: TState<TViewType, []>;
	activeSettingsSection: TState<TSettingsSectionType | null, []>;

	isReady: TState<boolean, []>;
	isDraggingLayer: TState<boolean, []>;
	shopify: ShopifyGlobal;
	boundingRect: TState<TBoundingRect, []>;
	canvasBoundingRect: TState<TBoundingRect, []>;

	editorRef: React.RefObject<HTMLDivElement>;
	canvasRef: React.RefObject<HTMLDivElement>;
	canvasContainerRef: React.RefObject<HTMLDivElement>;

	switchView: (view: TViewType) => void;
	switchSettingsSection: (section: TSettingsSectionType | null) => void;

	getRootNode: () => TState<TFlattenedNode<TPageNode>, []>;
	addNode: (node: TNode, parentId?: TNodeId, index?: number) => TNodeId;
	removeNode: (nodeId: TNodeId) => void;
	swapNodes: (nodeId1: TNodeId, nodeId2: TNodeId) => void;
	reorderNode: (nodeId: TNodeId, targetNodeId: TNodeId) => void;
	moveNode: (nodeId: TNodeId, newParentId: TNodeId) => void;
	updateNode: <GNode extends TFlattenedNode<TNode>>(
		nodeId: TNodeId,
		updates: Partial<GNode>
	) => void;
	selectNode: (nodeId: TNodeId) => void;
	unselectNode: () => void;
	copyNode: (nodeId: TNodeId) => TNodeId | null;

	getFontAsset: (hash: TAssetHash | undefined | null) => TFontAsset | null;
	registerFontFamily: (fontFamily: string) => TFont | null;
	loadFont: (fontOrHash: TFont | string) => void;
	loadFonts: () => void;

	getImageAsset: (hash: TAssetHash | undefined | null) => TImageAsset | null;
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
