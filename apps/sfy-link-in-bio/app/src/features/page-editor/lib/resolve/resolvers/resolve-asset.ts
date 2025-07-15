import { TAssetHash } from '@repo/editor';
import { TSiteProvider } from '../site-provider';

export function resolveAsset(
	hash: TAssetHash | undefined,
	site: TSiteProvider
): string | undefined {
	if (hash == null) {
		return undefined;
	}

	const asset = site.getAsset(hash);
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
