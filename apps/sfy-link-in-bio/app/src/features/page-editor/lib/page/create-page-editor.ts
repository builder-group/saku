import { deepCopy, shortId } from '@blgc/utils';
import {
	createId,
	getFontHash,
	getFontMetadataByFamily,
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
	TMixinToken,
	TMixinTokenKey,
	TNodeId,
	toHierarchical,
	TSite,
	TTokenMap,
	TVariableToken,
	TVariableTokenKey
} from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { FetchError, NetworkError, RequestError } from 'feature-fetch';
import { createState, TState } from 'feature-state';
import React from 'react';
import { appConfig, coreApiClient, logger } from '@/environment';
import { createShopifyTokenMiddleware, requestReview, TBreakpoint } from '@/lib';
import { TSettingsSectionType, TViewType } from '../../environment';
import { createNodeState, getNodeAssetHashes, nodeMetadataRegistry, TNodeState } from '../node';
import { createPageContext, TPageContext } from './create-page-context';

export function createPageEditor(config: TCreatePageEditorConfig): TPageEditor {
	const { shopify, site } = config;
	logger.info('createPageEditor', { config });

	return {
		id: shortId(),
		site: {
			id: site.id,
			handle: site.handle,
			version: site.content.version,
			url: site.url,
			platformUrl: site.platformUrl
		},
		pageContext: createPageContext({
			siteId: site.id,
			integrations: Object.values(site.content.integrations)
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

		assetsMap: site.content.assets,
		integrationsMap: site.content.integrations,
		mixinTokenMap: (() => {
			const mixinGroups: Record<string, Record<string, TMixinToken>> = {};

			// Iterate through flat tokens and group mixin tokens
			Object.values(site.content.tokens).forEach((token) => {
				if (token.type === 'mixin') {
					if (mixinGroups[token.mixinKey] == null) {
						mixinGroups[token.mixinKey] = {};
					}
					// @ts-expect-error - we ensure object exists above
					mixinGroups[token.mixinKey][token.key] = token;
				}
			});

			// Create state for each mixin group
			return Object.fromEntries(
				Object.entries(mixinGroups).map(([mixinKey, tokens]) => [mixinKey, createState(tokens)])
			);
		})(),
		variableTokenMap: createState(
			(() => {
				const variables: Record<string, TVariableToken> = {};
				Object.values(site.content.tokens).forEach((token) => {
					if (token.type === 'variable') {
						variables[token.key] = token;
					}
				});
				return variables;
			})()
		),

		activeView: createState('layers' as TViewType),
		activeSettingsSection: createState<TSettingsSectionType | null>('design'),

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
		canvasContainerRef: React.createRef<HTMLDivElement>(),

		switchView(view) {
			this.activeView.set(view);
			this.unselectNode();
			this.switchSettingsSection('design');
		},

		switchSettingsSection(section) {
			this.activeSettingsSection.set(section);
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
					type: nodeType,
					...deepCopy(nodeMetadata.default)
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
				id: createId('asset'),
				type: 'font',
				hash,
				contentType: 'font/woff2',
				storage: {
					type: 'url',
					url: `https://fonts.googleapis.com/css2?family=${fontMetadata.googleFont}&display=swap`
				},
				font: fontMetadata.font
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
			const assetId = createId('asset');
			const hash = assetId; // Temporary workaround until proper content hashing

			// Register the image
			this.assetsMap[hash] = {
				id: assetId,
				type: 'image',
				hash,
				contentType: 'image/jpeg', // TODO:
				storage: {
					type: 'url',
					url
				},
				dimensions,
				fileName
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
			if (document.querySelector(`link[data-font-id="${asset.id}"]`) != null) {
				return;
			}

			// Create and inject CSS link tag
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = asset.storage.url;
			link.setAttribute('data-font-id', asset.id);
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
					assetsToRemove.push(hash as TAssetHash);
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
			// Clean up unused assets before saving
			this.cleanupAssets();

			const result = await coreApiClient.put(
				'/v1/shopify/site/{siteId}/content',
				{
					content: this.toFlatSite() as any
				},
				{
					pathParams: {
						siteId: this.site.id
					},
					requestMiddlewares: [createShopifyTokenMiddleware(this.shopify)]
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
				assets: deepCopy(this.assetsMap),
				integrations: deepCopy(this.integrationsMap),
				tokens: (() => {
					const flatTokens: TTokenMap = {};

					// Add mixin tokens with mixin.mixinKey.key format
					Object.entries(this.mixinTokenMap).forEach(([mixinKey, state]) => {
						Object.values(state._v).forEach((token) => {
							flatTokens[`mixin.${mixinKey}.${token.key}` as TMixinTokenKey] = token;
						});
					});

					// Add variable tokens with variable.key format
					Object.values(this.variableTokenMap._v).forEach((token) => {
						flatTokens[`variable.${token.key}` as TVariableTokenKey] = token;
					});

					return flatTokens;
				})()
			} satisfies TFlatSite;
		}
	};
}

export interface TCreatePageEditorConfig {
	shopify: ShopifyGlobal;
	site: {
		id: string;
		handle: string;
		url: string;
		platformUrl: string;
		content: TFlatSite;
	};
}

export interface TPageEditor {
	id: string;
	site: {
		id: string;
		handle: string;
		version: TFlatSite['version'];
		url: string;
		platformUrl: string;
	};
	pageContext: TPageContext;

	rootNodeId: TNodeId;
	selectedNodeId: TState<TNodeId | null, []>;
	nodeMap: Record<TNodeId, TNodeState>;

	assetsMap: Record<TAssetHash, TAsset>;
	integrationsMap: Record<TIntegrationId, TIntegration>;
	mixinTokenMap: TMixinTokenGroupMap;
	variableTokenMap: TState<Record<string, TVariableToken>, []>;

	activeView: TState<TViewType, []>;
	activeSettingsSection: TState<TSettingsSectionType | null, []>;

	isReady: TState<boolean, []>;
	isDraggingLayer: TState<boolean, []>;
	shopify: ShopifyGlobal;
	boundingRect: TState<TBoundingRect, []>;
	breakpoint: TState<TBreakpoint, []>;
	canvasBoundingRect: TState<TBoundingRect, []>;

	editorRef: React.RefObject<HTMLDivElement>;
	canvasRef: React.RefObject<HTMLDivElement>;
	canvasContainerRef: React.RefObject<HTMLDivElement>;

	switchView: (view: TViewType) => void;
	switchSettingsSection: (section: TSettingsSectionType | null) => void;

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
	copyNode: (nodeId: TNodeId) => TNodeId | null;

	getFontAsset: (hash: TAssetHash | undefined | null) => TFontAsset | null;
	registerFontFamily: (fontFamily: string) => TFont | null;
	loadFont: (fontOrHash: TFont | TAssetHash) => void;
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
	toFlatSite: () => TFlatSite;
}

export interface TBoundingRect {
	left: number;
	top: number;
	bottom: number;
	right: number;
}

export type TMixinTokenGroupMap<GToken extends TMixinToken = TMixinToken> = {
	[K in GToken['mixinKey']]?: TMixinTokenSetState<Extract<GToken, { mixinKey: K }>>;
};

export type TMixinTokenSetState<GToken extends TMixinToken = TMixinToken> = TState<
	Record<string, GToken>,
	[]
>;
