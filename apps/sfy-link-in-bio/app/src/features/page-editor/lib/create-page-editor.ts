import { shortId } from '@blgc/utils';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { createState, TState } from 'feature-state';
import React from 'react';
import { coreApiClient } from '@/environment';
import { TViewType } from '../environment';
import { TNode, TNodeId, TPageNode, TSiteNode } from '../types';
import { createNodeState, TNodeState } from './create-node-state';
import { flattenNode, TFlattenedNode, unflattenNode } from './flatten-node';

export function createPageEditor(
	siteId: string,
	shopify: ShopifyGlobal,
	pageNode: TPageNode
): TPageEditor {
	return {
		id: shortId(),
		siteId,

		rootId: pageNode.id,
		nodeMap: flattenNode(pageNode, (node) => createNodeState(node)),
		selectedNodeId: createState<TNodeId | null>(null),

		activeView: createState('layers' as TViewType),
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
		},

		getRootNode() {
			return this.nodeMap[this.rootId] as TState<TFlattenedNode<TPageNode>, []>;
		},

		addNode(node, parentId) {
			const targetParentId = parentId ?? this.rootId;

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
			}
		},

		unselectNode() {
			this.selectedNodeId.set(null);
		},

		async save() {
			const idToken = await this.shopify.idToken();
			const pageNode = this.toPageNode();

			const result = await coreApiClient.put(
				'/v1/shopify/site/{siteId}/content',
				{
					content: {
						type: 'site',
						id: 'root',
						version: 'v0.0.1',
						children: [pageNode]
					} satisfies TSiteNode as any
				},
				{
					pathParams: {
						siteId: this.siteId as string
					},
					headers: {
						Authorization: `Bearer ${idToken}`
					}
				}
			);

			return result.isOk();
		},

		toPageNode() {
			return unflattenNode(this.nodeMap, this.rootId, (state) => state._v) as TPageNode;
		}
	};
}

export interface TPageEditor {
	id: string;
	siteId: string;

	rootId: TNodeId;
	nodeMap: Record<TNodeId, TNodeState>;
	selectedNodeId: TState<TNodeId | null, []>;

	activeView: TState<TViewType, []>;
	isReady: TState<boolean, []>;
	isDraggingLayer: TState<boolean, []>;
	shopify: ShopifyGlobal;
	boundingRect: TState<TBoundingRect, []>;
	canvasBoundingRect: TState<TBoundingRect, []>;

	editorRef: React.RefObject<HTMLDivElement>;
	canvasRef: React.RefObject<HTMLDivElement>;
	canvasContainerRef: React.RefObject<HTMLDivElement>;

	switchView: (view: TViewType) => void;

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

	save: () => Promise<boolean>;

	toPageNode: () => TPageNode;
}

export interface TBoundingRect {
	left: number;
	top: number;
	bottom: number;
	right: number;
}
