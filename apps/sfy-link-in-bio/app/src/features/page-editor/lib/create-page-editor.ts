import { shortId } from '@blgc/utils';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import React from 'react';
import { coreApiClient } from '@/environment';
import { fontFamilyToMetadata, TSettingsSectionType, TViewType } from '../environment';
import { TAsset, TAssetId, TFontAsset, TNode, TNodeId, TPageNode, TSite } from '../types';
import { createNodeState, TNodeState } from './create-node-state';
import { flattenNode, TFlattenedNode, unflattenNode } from './flatten-node';

export function createPageEditor(site: TSite, shopify: ShopifyGlobal): TPageEditor {
	return {
		id: shortId(),
		site: {
			id: site.id,
			version: site.version
		},

		nodeMap: flattenNode(site.root, (node) => createNodeState(node)),
		rootNodeId: site.root.id,
		selectedNodeId: createState<TNodeId | null>(null),

		assets: Object.fromEntries(site.assets.map((asset) => [asset.id, asset])),

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

		addNode(node, parentId) {
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

			// Add the root node to parent's children
			const parentState = this.nodeMap[targetParentId];
			if (parentState != null) {
				parentState.set((v) => {
					if ('children' in v) {
						// Only add if not already in children
						if (!v.children.includes(node.id)) {
							return { ...v, children: [...v.children, node.id] };
						}
					}
					return v;
				});
			}

			this.selectNode(node.id);
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

		applyFont(fontFamily) {
			// Get metadata from font family
			const fontMetadata = fontFamilyToMetadata[fontFamily];
			if (fontMetadata == null) {
				return;
			}

			// Skip system fonts
			if (fontMetadata.googleFont == null) {
				return;
			}

			const assetId = `font-${fontMetadata.key}`;
			if (this.assets[assetId] != null) {
				return;
			}

			// Create new font asset
			const fontAsset: TFontAsset = {
				id: assetId,
				type: 'font',
				contentType: 'font/woff2',
				content: {
					type: 'url',
					url: `https://fonts.googleapis.com/css2?family=${fontMetadata.googleFont}&display=swap`
				},
				fileName: `${fontMetadata.name}.woff2`
			};

			// Add to assets
			this.assets[assetId] = fontAsset;

			// Load the font
			this.loadFont(assetId);
		},

		loadFont(assetId) {
			const asset = this.assets[assetId];
			if (asset == null || asset.type !== 'font' || asset.content.type !== 'url') {
				return;
			}

			// Check if already loaded in DOM
			if (document.querySelector(`link[data-font-id="${assetId}"]`) != null) {
				return;
			}

			// Create and inject CSS link tag
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = asset.content.url;
			link.setAttribute('data-font-id', assetId);
			document.head.appendChild(link);
		},

		loadFonts() {
			Object.keys(this.assets).forEach((assetId) => {
				const asset = this.assets[assetId];
				if (asset?.type === 'font') {
					this.loadFont(assetId);
				}
			});
		},

		getUsedAssetIds() {
			const usedAssets = new Set<string>();

			// Scan all nodes for asset references
			Object.values(this.nodeMap).forEach((nodeState) => {
				const node = nodeState._v;

				// Check if node has style with fontFamily
				if ('style' in node && node.style && typeof node.style === 'object') {
					const style = node.style as { fontFamily?: string };
					if (style.fontFamily != null && typeof style.fontFamily === 'string') {
						// Map font family to asset ID
						const fontMetadata = fontFamilyToMetadata[style.fontFamily];
						if (fontMetadata?.googleFont) {
							usedAssets.add(`font-${fontMetadata.key}`);
						}
					}
				}
			});

			return usedAssets;
		},

		cleanupUnusedAssets() {
			const usedAssets = this.getUsedAssetIds();
			const assetsToRemove: string[] = [];

			// Find unused assets
			Object.keys(this.assets).forEach((assetId) => {
				if (!usedAssets.has(assetId)) {
					assetsToRemove.push(assetId);
				}
			});

			// Remove unused assets
			assetsToRemove.forEach((assetId) => {
				const asset = this.assets[assetId];

				// Remove from assets map
				delete this.assets[assetId];

				// Remove from DOM if it's a font
				if (asset?.type === 'font') {
					const linkElement = document.querySelector(`link[data-font-id="${assetId}"]`);
					if (linkElement != null) {
						linkElement.remove();
					}
				}
			});

			return assetsToRemove;
		},

		async save() {
			const idToken = await this.shopify.idToken();

			// Clean up unused assets before saving
			this.cleanupUnusedAssets();

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
				...this.site,
				root: unflattenNode(this.nodeMap, this.rootNodeId, (state) => state._v) as TPageNode,
				assets: Object.values(this.assets)
			} satisfies TSite;
		}
	};
}

export interface TPageEditor {
	id: string;
	site: Omit<TSite, 'root' | 'assets'>;

	rootNodeId: TNodeId;
	selectedNodeId: TState<TNodeId | null, []>;
	nodeMap: Record<TNodeId, TNodeState>;

	assets: Record<TAssetId, TAsset>;

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
	addNode: (node: TNode, parentId?: TNodeId) => void;
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

	applyFont: (fontFamily: string) => void;
	loadFont: (assetId: string) => void;
	loadFonts: () => void;

	getUsedAssetIds: () => Set<string>;
	cleanupUnusedAssets: () => string[];

	save: () => Promise<boolean>;

	toSite: () => TSite;
}

export interface TBoundingRect {
	left: number;
	top: number;
	bottom: number;
	right: number;
}
