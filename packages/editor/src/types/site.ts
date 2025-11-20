import { TFlatNode, TNode, TNodeId } from './node';
import { TToken } from './token';
import { TAsset, TAssetHash, TIntegration, TIntegrationId } from './utils';

export interface TSite {
	version: TLatestSiteVersion; // Enforces latest version to prevent version/schema mismatches
	root: TNode;
	assets: TAsset[];
	integrations: TIntegration[];
	tokens: TToken[];
}

export interface TFlatSite {
	version: TLatestSiteVersion; // Enforces latest version to prevent version/schema mismatches
	rootId: TNodeId;
	nodes: Record<TNodeId, TFlatNode>;
	assets: Record<TAssetHash, TAsset>;
	integrations: Record<TIntegrationId, TIntegration>;
	tokens: Record<TToken['key'], TToken>;
}

export type TSiteVersion = `v0.0.1` | `v0.0.2` | `v0.0.3` | TLatestSiteVersion;
export type TLatestSiteVersion = `v0.0.4`;
