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

	public getSite(): TFlatSite {
		return this.site;
	}

	public getTokenSet<GType extends keyof TTokenGroupMap>(
		type: GType
	): TTokenGroupMap[GType] | null {
		return this.site.tokens[type] || null;
	}
}

export class EditorSiteResolveContext implements TSiteResolveContext {
	private readonly editor: TPageEditor;

	constructor(editor: TPageEditor) {
		this.editor = editor;
	}

	public getNode(id: TNodeId): TFlatNode | null {
		return this.editor.nodeMap[id]?.get() || null;
	}

	public getAsset(hash: TAssetHash): TAsset | null {
		return this.editor.assetsMap[hash] || null;
	}

	public getSite(): TFlatSite {
		return this.editor.toFlatSite();
	}

	public getTokenSet<GType extends keyof TTokenGroupMap>(
		type: GType
	): TTokenGroupMap[GType] | null {
		return this.editor.tokensMap[type] || null;
	}
}

export interface TSiteResolveContext {
	getNode(id: TNodeId): TFlatNode | null;
	getAsset(hash: TAssetHash): TAsset | null;
	getSite(): TFlatSite;
	getTokenSet<GType extends keyof TTokenGroupMap>(type: GType): TTokenGroupMap[GType] | null;
}
