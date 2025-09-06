import {
	TAsset,
	TAssetHash,
	TFlatNode,
	TFlatSite,
	TIntegration,
	TIntegrationId,
	TMixinTokenGroupMap,
	TNodeId,
	TVariableToken
} from '@repo/editor';
import { TSiteHydrateContext } from './types';

/**
 * Site-based provider - works with static site data
 */
export class StaticSiteHydrateContext implements TSiteHydrateContext {
	public readonly id: string;
	public readonly handle: string;
	private readonly site: TFlatSite;
	private readonly mixinTokenGroupMap: TMixinTokenGroupMap = {};
	private readonly variableTokenMap: Record<string, TVariableToken> = {};

	constructor(site: TFlatSite, id: string, handle: string) {
		this.site = site;
		this.id = id;
		this.handle = handle;
		this.createTokenMaps();
	}

	private createTokenMaps(): void {
		Object.values(this.site.tokens).forEach((token) => {
			switch (token.type) {
				case 'mixin': {
					const mixinKey = token.mixinKey;
					if (this.mixinTokenGroupMap[mixinKey] == null) {
						this.mixinTokenGroupMap[mixinKey] = {};
					}
					this.mixinTokenGroupMap[mixinKey][token.key] = token;
					break;
				}
				case 'variable': {
					this.variableTokenMap[token.key] = token;
					break;
				}
			}
		});
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

	public getMixinTokenSet<GGroupKey extends keyof TMixinTokenGroupMap>(
		groupKey: GGroupKey
	): TMixinTokenGroupMap[GGroupKey] | null {
		return this.mixinTokenGroupMap[groupKey] || null;
	}

	public getVariableTokenMap(): Record<string, TVariableToken> {
		return this.variableTokenMap;
	}
}
