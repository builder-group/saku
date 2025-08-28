import {
	TAsset,
	TAssetHash,
	TFlatNode,
	TFlatSite,
	TIntegration,
	TIntegrationId,
	TMixinTokenGroupMap,
	TNodeId
} from '@repo/editor';
import { TSiteHydrateContext } from './types';

/**
 * Site-based provider - works with static site data
 */
export class StaticSiteHydrateContext implements TSiteHydrateContext {
	public readonly id: string;
	public readonly handle: string;
	private readonly site: TFlatSite;
	private readonly mixinTokenGroupMap: TMixinTokenGroupMap;

	constructor(site: TFlatSite, id: string, handle: string) {
		this.site = site;
		this.id = id;
		this.handle = handle;
		this.mixinTokenGroupMap = this.createMixinTokenGroupMap();
	}

	private createMixinTokenGroupMap(): TMixinTokenGroupMap {
		const groups: TMixinTokenGroupMap = {};

		Object.values(this.site.tokens).forEach((token) => {
			if (token.type === 'mixin') {
				const mixinKey = token.mixinKey;
				if (groups[mixinKey] == null) {
					groups[mixinKey] = {};
				}
				groups[mixinKey][token.key] = token;
			}
		});

		return groups;
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

	public getTokenSet<GGroupKey extends keyof TMixinTokenGroupMap>(
		groupKey: GGroupKey
	): TMixinTokenGroupMap[GGroupKey] | null {
		return this.mixinTokenGroupMap[groupKey] || null;
	}
}
