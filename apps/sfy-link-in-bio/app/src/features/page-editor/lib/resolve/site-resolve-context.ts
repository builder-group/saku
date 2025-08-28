import {
	TAsset,
	TAssetHash,
	TFlatNode,
	TFlatSite,
	TMixinTokenGroupMap,
	TNodeId
} from '@repo/editor';
import { TPageEditor } from '../page';

export class StaticSiteResolveContext implements TSiteResolveContext {
	private readonly site: TFlatSite;
	private readonly mixinTokenGroupMap: TMixinTokenGroupMap;

	constructor(site: TFlatSite) {
		this.site = site;
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

	public getTokenSet<GGroupKey extends keyof TMixinTokenGroupMap>(
		groupKey: GGroupKey
	): TMixinTokenGroupMap[GGroupKey] | null {
		return this.mixinTokenGroupMap[groupKey] || null;
	}

	public getSite(): TFlatSite {
		return this.site;
	}
}

export class EditorSiteResolveContext implements TSiteResolveContext {
	private readonly editor: TPageEditor;

	constructor(editor: TPageEditor) {
		this.editor = editor;
	}

	public getNode(id: TNodeId): TFlatNode | null {
		return this.editor.nodeMap[id]?._v || null;
	}

	public getAsset(hash: TAssetHash): TAsset | null {
		return this.editor.assetsMap[hash] || null;
	}

	public getTokenSet<GGroupKey extends keyof TMixinTokenGroupMap>(
		groupKey: GGroupKey
	): TMixinTokenGroupMap[GGroupKey] | null {
		return (this.editor.mixinTokenMap[groupKey]?._v || null) as
			| TMixinTokenGroupMap[GGroupKey]
			| null;
	}

	public getSite(): TFlatSite {
		return this.editor.toFlatSite();
	}
}

export interface TSiteResolveContext {
	getNode(id: TNodeId): TFlatNode | null;
	getAsset(hash: TAssetHash): TAsset | null;
	getTokenSet<GGroupKey extends keyof TMixinTokenGroupMap>(
		groupKey: GGroupKey
	): TMixinTokenGroupMap[GGroupKey] | null;
	getSite(): TFlatSite;
}
