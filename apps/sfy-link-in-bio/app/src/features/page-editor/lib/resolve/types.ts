import { TAsset, TAssetHash, TFlatNode, TFlatSite, TNodeId, TPageNode } from '@repo/editor';

export interface TNodeResolveContext {
	site: TSiteResolveContext;
	parentId?: TNodeId;
	resolved?: {
		childDefaults?: TPageNode['childDefaults'];
	};
}

export interface TSiteResolveContext {
	getNode(id: TNodeId): TFlatNode | null;
	getAsset(hash: TAssetHash): TAsset | null;
	getSite(): TFlatSite;
}
