import { TFlatNode, TNode, TNodeId } from './node';
import { TTokens } from './token';
import { TAsset, TAssetHash, TIntegration, TIntegrationId } from './utils';

export interface TSite {
	version: `v0.0.1`;
	root: TNode;
	assets: TAsset[];
	integrations: TIntegration[];
	tokens: TTokens;
}

export interface TFlatSite {
	version: TSite['version'];
	rootId: TNodeId;
	nodes: Record<TNodeId, TFlatNode>;
	assets: Record<TAssetHash, TAsset>;
	integrations: Record<TIntegrationId, TIntegration>;
	tokens: TTokens;
}
