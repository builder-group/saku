import { TAsset, TAssetHash, TFlatNode, TFlatSite, TNodeId } from '@repo/editor';
import { TSiteResolveContext } from '../../../lib';

export interface TSiteHydrateContext extends TSiteResolveContext {
	getNode(id: TNodeId): TFlatNode | null;
	getAsset(hash: TAssetHash): TAsset | null;
	getSite(): TFlatSite;
}
