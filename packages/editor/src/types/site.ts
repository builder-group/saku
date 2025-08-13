import { TAsset, TFlatNode, TIntegration, TNode } from '../types';

export interface TSite {
	version: `v0.0.1`;
	root: TNode;
	assets: TAsset[];
	integrations: TIntegration[];
}

export interface TFlatSite {
	version: TSite['version'];
	rootId: string;
	nodes: Record<string, TFlatNode>;
	assets: Record<string, TAsset>;
	integrations: Record<string, TIntegration>;
}
