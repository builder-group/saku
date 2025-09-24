import {
	TAsset,
	TAssetHash,
	TFlatNode,
	TFlatSite,
	TIntegration,
	TIntegrationId,
	TNodeId,
	TToken
} from '@repo/editor';
import { TSiteHydrateContext } from './types';

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

	public getTokenMap(): Record<string, TToken> {
		return this.site.tokens;
	}
}
