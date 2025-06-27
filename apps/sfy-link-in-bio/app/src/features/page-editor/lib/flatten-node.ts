import { TNode, TNodeId } from '../types';

/**
 * Flattens a hierarchical node structure into a flat map
 * @param rootNode - The root node to flatten
 * @param mapper - Optional function to transform each flattened node (defaults to identity)
 * @returns Record of node IDs to transformed values
 */
export function flattenNode<GFlattenedNode = TFlattenedNode<TNode>>(
	rootNode: TNode,
	mapper?: (node: TFlattenedNode<TNode>) => GFlattenedNode
): Record<TNodeId, GFlattenedNode> {
	const nodeMap: Record<TNodeId, GFlattenedNode> = {};

	function traverse(node: TNode, parentId: TNodeId | null = null): void {
		// Create flattened node with children as IDs and parentId
		const flattenedNode: TFlattenedNode<TNode> =
			'children' in node && Array.isArray(node.children)
				? { ...node, children: node.children.map((child) => child.id), parentId }
				: ({ ...node, parentId } as TFlattenedNode<TNode>);

		nodeMap[node.id] = mapper ? mapper(flattenedNode) : (flattenedNode as GFlattenedNode);

		// Recursively traverse children with current node as parent
		if ('children' in node && Array.isArray(node.children)) {
			node.children.forEach((child) => traverse(child, node.id));
		}
	}

	traverse(rootNode);
	return nodeMap;
}

/**
 * Reconstructs a hierarchical structure from a flattened node map
 * @param nodeMap - Map of flattened nodes (can be raw or wrapped in containers)
 * @param rootId - ID of the root node to start reconstruction from
 * @param extractor - Function to extract the flattened node from container (defaults to identity)
 * @returns Reconstructed hierarchical node
 */
export function unflattenNode<GContainer, GNode = TNode>(
	nodeMap: Record<TNodeId, GContainer>,
	rootId: TNodeId,
	extractor?: (container: GContainer) => TFlattenedNode<TNode>
): GNode {
	function reconstructNode(nodeId: TNodeId): GNode {
		const container = nodeMap[nodeId];
		if (container == null) {
			throw new Error(`Node ${nodeId} not found`);
		}

		// Extract the flattened node from its container
		const flatNode = extractor
			? extractor(container)
			: (container as unknown as TFlattenedNode<TNode>);

		if ('children' in flatNode && flatNode.children.length > 0) {
			// Recursively reconstruct children
			const children = flatNode.children.map((childId) => reconstructNode(childId));

			// Remove parentId when reconstructing hierarchical structure
			const { parentId, ...nodeWithoutParentId } = flatNode;
			const hierarchicalNode = { ...nodeWithoutParentId, children } as TNode;

			return hierarchicalNode as GNode;
		}

		// Remove parentId for leaf nodes
		const { parentId, ...nodeWithoutParentId } = flatNode;
		const hierarchicalNode = nodeWithoutParentId as TNode;

		return hierarchicalNode as GNode;
	}

	return reconstructNode(rootId);
}

export type TFlattenedNode<GNode> = GNode extends { children: TNode[] }
	? Omit<GNode, 'children'> & { children: TNodeId[]; parentId: TNodeId | null }
	: GNode & { parentId: TNodeId | null };
