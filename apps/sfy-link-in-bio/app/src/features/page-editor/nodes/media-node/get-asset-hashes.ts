import { isTokenRef, TAssetHash, TMediaNode } from '@repo/editor';

/**
 * Extracts asset hashes from a media node
 */
export function getMediaNodeAssetHashes(node: TMediaNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Media asset
	if (node.content.media?.hash != null) {
		hashes.push(node.content.media.hash);
	}

	// Fill asset (if not linked)
	if (!isTokenRef(node.fill) && node.fill?.paint.type === 'image' && node.fill.paint.hash != null) {
		hashes.push(node.fill.paint.hash);
	}

	return hashes;
}
