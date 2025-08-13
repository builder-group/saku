import {
	TAsset,
	TAssetHash,
	TFlatNode,
	TIntegration,
	TIntegrationId,
	TNode,
	TNodeId
} from '../types';

export interface TSite {
	version: `v0.0.1`;
	root: TNode;
	assets: TAsset[];
	integrations: TIntegration[];
}

export interface TFlatSite {
	version: TSite['version'];
	rootId: TNodeId;
	nodes: Record<TNodeId, TFlatNode>;
	assets: Record<TAssetHash, TAsset>;
	integrations: Record<TIntegrationId, TIntegration>;
}
