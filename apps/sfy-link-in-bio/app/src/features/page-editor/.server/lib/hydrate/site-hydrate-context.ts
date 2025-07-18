import { TAsset, TAssetHash, TFlatNode, TFlatSite, TNodeId } from '@repo/editor';
import { TSiteHydrateContext } from './types';

/**
 * Site-based provider - works with static site data
 */
export class StaticSiteHydrateContext implements TSiteHydrateContext {
	private readonly site: TFlatSite;
	public readonly shopId: string;
	public readonly handle: string;

	constructor(site: TFlatSite, shopId: string, handle: string) {
		this.site = site;
		this.shopId = shopId;
		this.handle = handle;
	}

	public getNode(id: TNodeId): TFlatNode | null {
		return this.site.nodes[id] || null;
	}

	public getAsset(hash: TAssetHash): TAsset | null {
		return this.site.assets[hash] || null;
	}

	public getSite(): TFlatSite {
		return this.site;
	}
}
