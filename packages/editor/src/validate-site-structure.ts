import { TNodeId, TSite } from './types';

/**
 * Validates that all node references exist and there are no circular dependencies
 */
export function validateSiteStructure(site: TSite): boolean {
	const visited = new Set<TNodeId>();
	const visiting = new Set<TNodeId>();

	function validateNode(nodeId: TNodeId): boolean {
		if (visiting.has(nodeId)) {
			return false; // Circular dependency
		}
		if (visited.has(nodeId)) {
			return true; // Already validated
		}

		const node = site.nodes[nodeId];
		if (node == null) {
			return false; // Missing node
		}

		visiting.add(nodeId);

		if (node.type === 'page') {
			for (const childId of node.children) {
				if (!validateNode(childId)) {
					return false;
				}
			}
		}

		visiting.delete(nodeId);
		visited.add(nodeId);
		return true;
	}

	return validateNode(site.rootId);
}
