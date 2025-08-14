import { TAsset, TAssetHash } from '@repo/editor';

export function resolveAsset(
	hash: TAssetHash,
	cx: {
		getAsset: (hash: TAssetHash) => TAsset | null;
	}
): string | undefined {
	const asset = cx.getAsset(hash);
	if (asset == null) {
		return undefined;
	}

	if (asset.storage.type === 'url') {
		return asset.storage.url;
	}

	if (asset.storage.type === 'embedded') {
		return asset.storage.data; // base64
	}

	return undefined;
}
