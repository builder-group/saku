import { TAsset, TAssetHash, TFlatNode, TFlatSite, TNodeId } from '@repo/editor';

export interface TSiteResolveContext {
	getNode(id: TNodeId): TFlatNode | null;
	getAsset(hash: TAssetHash): TAsset | null;
	getSite(): TFlatSite;
}
