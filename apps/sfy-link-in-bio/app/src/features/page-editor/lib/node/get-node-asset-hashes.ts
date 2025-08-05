import { TAssetHash, TFlatNode } from '@repo/editor';
import { nodeAssetHashRegistry } from './registry';

/**
 * Extracts all asset hashes referenced by a node
 */
export function getNodeAssetHashes(node: TFlatNode): TAssetHash[] {
	const assetHashFunction = nodeAssetHashRegistry[node.type];
	if (assetHashFunction == null) {
		return [];
	}

	return assetHashFunction(node as any);
}
