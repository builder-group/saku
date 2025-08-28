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
	// Convert assets array to record
	const assets: Record<TAssetHash, TAsset> = {};
	site.assets.forEach((asset) => {
		assets[asset.hash] = asset;
	});

	// Convert integrations array to record
	const integrations: Record<TIntegrationId, TIntegration> = {};
	site.integrations.forEach((integration) => {
		integrations[integration.id] = integration;
	});

	// Convert tokens array to record
	const tokens: TTokenMap = {};
	site.tokens.forEach((token) => {
		switch (token.type) {
			case 'variable': {
				tokens[`variable.${token.key}`] = token;
				break;
			}
			case 'mixin': {
				tokens[`mixin.${token.mixinKey}.${token.key}`] = token as any;
				break;
			}
		}
	});

	// Convert nodes to flat structure
	const nodes: Record<TNodeId, TFlatNode> = {};
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
