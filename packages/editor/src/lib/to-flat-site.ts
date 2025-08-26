import {
	TAsset,
	TAssetHash,
	TFlatNode,
	TFlatPageNode,
	TFlatSite,
	TIntegration,
	TIntegrationId,
	TNode,
	TNodeId,
	TSite,
	TTokenMap
} from '../types';

/**
 * Convert hierarchical site structure to flat structure
 */
export function toFlatSite(site: TSite): TFlatSite {
	const nodes: Record<TNodeId, TFlatNode> = {};
	const assets: Record<TAssetHash, TAsset> = {};
	const integrations: Record<TIntegrationId, TIntegration> = {};
	const tokens: TTokenMap = {};

	// Convert assets array to record
	site.assets.forEach((asset) => {
		assets[asset.hash] = asset;
	});

	// Convert integrations array to record
	site.integrations.forEach((integration) => {
		integrations[integration.id] = integration;
	});

	// Convert tokens array to record
	site.tokens.forEach((token) => {
		const tokenType = token.type;
		if (tokens[tokenType] == null) {
			tokens[tokenType] = {};
		}
		tokens[tokenType][token.key] = token.value;
	});

	const convertNode = (node: TNode): TNodeId => {
		switch (node.type) {
			case 'page': {
				const childIds = node.children.map(convertNode);
				nodes[node.id] = {
					...node,
					children: childIds
				} as TFlatPageNode;
				break;
			}
			default: {
				nodes[node.id] = node as TFlatNode;
			}
		}

		return node.id;
	};

	const rootId = convertNode(site.root);

	return {
		version: site.version,
		rootId,
		nodes,
		assets,
		integrations,
		tokens
	};
}
