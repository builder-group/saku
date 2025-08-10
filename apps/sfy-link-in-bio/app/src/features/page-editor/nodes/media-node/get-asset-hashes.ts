import { TAssetHash, TMediaNode } from '@repo/editor';

/**
 * Extracts asset hashes from a media node
 */
export function getMediaNodeAssetHashes(node: TMediaNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Media asset
	if (node.content.media?.hash != null) {
		hashes.push(node.content.media.hash);
	}

	return hashes;
}
