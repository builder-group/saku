import {
	getFontHash,
	isInherited,
	TAssetHash,
	TFlatPageNode,
	TImagePaint,
	TPaint
} from '@repo/editor';

/**
 * Extracts asset hashes from a page node
 */
export function getPageNodeAssetHashes(node: TFlatPageNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Font asset
	if (node.childMixins?.text?.typography?.font != null) {
		hashes.push(getFontHash(node.childMixins.text.typography.font));
	}

	// Metadata image asset
	if (node.content.metadata?.image != null) {
		hashes.push(node.content.metadata.image);
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
