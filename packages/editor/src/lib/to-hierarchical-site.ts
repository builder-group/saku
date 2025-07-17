import { TFlatSite, TNode, TNodeId, TPageNode, TSite } from '../types';

/**
 * Convert flat site structure to hierarchical structure
 */
export function toHierarchical(flatSite: TFlatSite): TSite {
	const convertNode = (nodeId: TNodeId): TNode => {
		const flatNode = flatSite.nodes[nodeId];
		if (!flatNode) {
			throw new Error(`Node ${nodeId} not found`);
		}

		if (flatNode.type === 'page') {
			return {
				...flatNode,
				children: flatNode.children.map(convertNode)
			} as TPageNode;
		}

		return flatNode as TNode;
	};

	return {
		version: flatSite.version,
		root: convertNode(flatSite.rootId),
		assets: Object.values(flatSite.assets)
	};
}
