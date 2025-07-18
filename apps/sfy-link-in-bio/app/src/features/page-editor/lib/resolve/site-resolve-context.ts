import { TAsset, TAssetHash, TFlatNode, TFlatSite, TNodeId } from '@repo/editor';
import { TPageEditor } from '../create-page-editor';
import { TSiteResolveContext } from './types';

/**
 * Site-based provider - works with static site data
 */
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
}

/**
 * Editor-based provider - works with live TPageEditor data
 */
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
}
