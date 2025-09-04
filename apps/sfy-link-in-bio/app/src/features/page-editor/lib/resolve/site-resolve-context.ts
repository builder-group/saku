import {
	TAsset,
	TAssetHash,
	TFlatNode,
	TFlatSite,
	TMixinTokenGroupMap,
	TNodeId,
	TVariableToken
} from '@repo/editor';
import { TPageEditor } from '../page';

export class StaticSiteResolveContext implements TSiteResolveContext {
	private readonly site: TFlatSite;
	private readonly mixinTokenGroupMap: TMixinTokenGroupMap = {};
	private readonly variableTokenMap: Record<string, TVariableToken> = {};

	constructor(site: TFlatSite) {
		this.site = site;
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

	public getMixinTokenSet<GGroupKey extends keyof TMixinTokenGroupMap>(
		groupKey: GGroupKey
	): TMixinTokenGroupMap[GGroupKey] | null {
		return this.mixinTokenGroupMap[groupKey] || null;
	}

	public getVariableTokenMap(): Record<string, TVariableToken> {
		return this.variableTokenMap;
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

	public getMixinTokenSet<GGroupKey extends keyof TMixinTokenGroupMap>(
		groupKey: GGroupKey
	): TMixinTokenGroupMap[GGroupKey] | null {
		return (this.editor.mixinTokenMap[groupKey]?._v || null) as
			| TMixinTokenGroupMap[GGroupKey]
			| null;
	}

	public getVariableTokenMap(): Record<string, TVariableToken> {
		return this.editor.variableTokenMap._v;
	}

	public getSite(): TFlatSite {
		return this.editor.toFlatSite();
	}
}

export interface TSiteResolveContext {
	getNode(id: TNodeId): TFlatNode | null;
	getAsset(hash: TAssetHash): TAsset | null;
	getMixinTokenSet<GGroupKey extends keyof TMixinTokenGroupMap>(
		groupKey: GGroupKey
	): TMixinTokenGroupMap[GGroupKey] | null;
	getVariableTokenMap(): Record<string, TVariableToken>;
	getSite(): TFlatSite;
}
