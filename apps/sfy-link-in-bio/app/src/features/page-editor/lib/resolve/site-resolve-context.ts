import { TAsset, TAssetHash, TFlatNode, TFlatSite, TNodeId, TToken } from '@repo/editor';
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

	public getTokenMap(): Record<string, TToken> {
		return this.site.tokens;
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

	public getTokenMap(): Record<string, TToken> {
		return this.editor.tokenMap._v;
	}

	public getSite(): TFlatSite {
		return this.editor.toFlatSite();
	}
}

export interface TSiteResolveContext {
	getNode(id: TNodeId): TFlatNode | null;
	getAsset(hash: TAssetHash): TAsset | null;
	getTokenMap(): Record<string, TToken>;
	getSite(): TFlatSite;
}
