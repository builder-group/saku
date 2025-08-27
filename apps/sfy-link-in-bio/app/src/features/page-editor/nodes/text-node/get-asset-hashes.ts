import {
	getFontHash,
	isInherited,
	isTokenRef,
	TAssetHash,
	TImagePaint,
	TPaint,
	TTextNode
} from '@repo/editor';

/**
 * Extracts asset hashes from a text node
 */
export function getTextNodeAssetHashes(node: TTextNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Font asset (if not inherited)
	if (
		!isTokenRef(node.text.typography) &&
		!isInherited(node.text.typography) &&
		!isTokenRef(node.text.typography.font) &&
		!isInherited(node.text.typography.font)
	) {
		hashes.push(getFontHash(node.text.typography.font));
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
