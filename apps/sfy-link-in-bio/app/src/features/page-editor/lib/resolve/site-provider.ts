import { TAsset, TAssetHash, TFlatNode, TFlatSite, TNodeId } from '@repo/editor';
import { TPageEditor } from '../create-page-editor';

/**
 * Site-based provider - works with static site data
 */
export class StaticSiteProvider implements TSiteProvider {
	private readonly site: TFlatSite;
	public readonly shopId: string;

	constructor(site: TFlatSite, shopId: string) {
		this.site = site;
		this.shopId = shopId;
	}

	public getNode(id: TNodeId): TFlatNode | null {
		return this.site.nodes[id] || null;
	}

	public getAsset(hash: TAssetHash): TAsset | null {
		return this.site.assets[hash] || null;
	}
}

/**
 * Editor-based provider - works with live TPageEditor data
 */
export class EditorSiteProvider implements TSiteProvider {
	private readonly editor: TPageEditor;
	public readonly shopId: string;

	constructor(editor: TPageEditor) {
		this.editor = editor;
		this.shopId = editor.shopId;
	}

	public getNode(id: TNodeId): TFlatNode | null {
		return this.editor.nodeMap[id]?.get() || null;
	}

	public getAsset(hash: TAssetHash): TAsset | null {
		return this.editor.assetsMap[hash] || null;
	}
}

export interface TSiteProvider {
	readonly shopId: string;

	getNode(id: TNodeId): TFlatNode | null;
	getAsset(hash: TAssetHash): TAsset | null;
}
