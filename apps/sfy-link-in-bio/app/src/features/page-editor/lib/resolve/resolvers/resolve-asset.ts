import { TAsset, TAssetHash } from '@repo/editor';

export function resolveAsset(
	hash: TAssetHash,
	cx: {
		getAsset: (hash: TAssetHash) => TAsset | null;
	}
): TResolvedAsset | undefined {
	const asset = cx.getAsset(hash);
	if (asset == null) {
		return undefined;
	}

	if (asset.storage.type === 'url') {
		return {
			src: asset.storage.url
		};
	}

	if (asset.storage.type === 'embedded') {
		return {
			src: `data:${asset.contentType};base64,${asset.storage.data}`
		};
	}

	return undefined;
}

export interface TResolvedAsset {
	src: string;
}
