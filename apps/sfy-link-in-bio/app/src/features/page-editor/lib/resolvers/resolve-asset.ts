import { TAsset, TAssetHash } from '@repo/editor';

export function resolveAsset(
	hash: TAssetHash | undefined,
	assetsMap: Record<TAssetHash, TAsset>
): string | undefined {
	if (hash == null) {
		return undefined;
	}

	const asset = assetsMap[hash];
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
