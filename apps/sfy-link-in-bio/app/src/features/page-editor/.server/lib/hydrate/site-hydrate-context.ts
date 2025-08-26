import {
	TAsset,
	TAssetHash,
	TFlatNode,
	TFlatSite,
	TIntegration,
	TIntegrationId,
	TNodeId,
	TTokenGroupMap
} from '@repo/editor';
import { TSiteHydrateContext } from './types';

/**
 * Site-based provider - works with static site data
 */
export class StaticSiteHydrateContext implements TSiteHydrateContext {
	public readonly id: string;
	public readonly handle: string;
	private readonly site: TFlatSite;

	constructor(site: TFlatSite, id: string, handle: string) {
		this.site = site;
		this.id = id;
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

	public getIntegration(id: TIntegrationId): TIntegration | null {
		return this.site.integrations[id] ?? null;
	}

	public getTokenSet<GGroupKey extends keyof TTokenGroupMap>(
		groupKey: GGroupKey
	): TTokenGroupMap[GGroupKey] | null {
		return this.site.tokens[groupKey] || null;
	}
}
