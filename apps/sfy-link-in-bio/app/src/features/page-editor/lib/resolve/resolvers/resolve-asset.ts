import { TAssetHash } from '@repo/editor';
import { TSiteResolveContext } from '../types';

export function resolveAsset(
	hash: TAssetHash | undefined,
	cx: TSiteResolveContext
): string | undefined {
	if (hash == null) {
		return undefined;
	}

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
