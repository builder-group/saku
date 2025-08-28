import { TAsset, TAssetHash, TFlatNode, TFlatSite, TNodeId, TTokenGroupMap } from '@repo/editor';
import { TPageEditor } from '../page';

export class StaticSiteResolveContext implements TSiteResolveContext {
	private readonly site: TFlatSite;

	constructor(site: TFlatSite) {
		this.site = site;
	}

	public getNode(id: TNodeId): TFlatNode | null {
		return this.site.nodes[id] || null;
	}

	public getAsset(hash: TAssetHash): TAsset | null {
		return this.site.assets[hash] || null;
	}

	public getTokenSet<GGroupKey extends keyof TTokenGroupMap>(
		groupKey: GGroupKey
	): TTokenGroupMap[GGroupKey] | null {
		return this.site.tokens[groupKey] || null;
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

	public getTokenSet<GGroupKey extends keyof TTokenGroupMap>(
		groupKey: GGroupKey
	): TTokenGroupMap[GGroupKey] | null {
		return this.editor.tokensMap[groupKey]?._v as TTokenGroupMap[GGroupKey] | null;
	}

	public getSite(): TFlatSite {
		return this.editor.toFlatSite();
	}
}

export interface TSiteResolveContext {
	getNode(id: TNodeId): TFlatNode | null;
	getAsset(hash: TAssetHash): TAsset | null;
	getTokenSet<GGroupKey extends keyof TTokenGroupMap>(
		groupKey: GGroupKey
	): TTokenGroupMap[GGroupKey] | null;
	getSite(): TFlatSite;
}
