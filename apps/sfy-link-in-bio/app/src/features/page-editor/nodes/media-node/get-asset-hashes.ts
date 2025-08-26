import { isInherited, TAssetHash, TImagePaint, TMediaNode, TPaint } from '@repo/editor';

/**
 * Extracts asset hashes from a media node
 */
export function getMediaNodeAssetHashes(node: TMediaNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Media asset
	if (node.content.media?.hash != null) {
		hashes.push(node.content.media.hash);
	}

	// Fill asset (if not inherited)
	if (
		node.fill != null &&
		!isInherited(node.fill) &&
		(node.fill as { paint: TPaint }).paint.type === 'image' &&
		(node.fill as { paint: TImagePaint }).paint.hash != null
	) {
		hashes.push((node.fill as { paint: TImagePaint }).paint.hash as TAssetHash);
	}

	return hashes;
}
