import {
	getFontHash,
	isInherited,
	TAboutNode,
	TAssetHash,
	TFont,
	TImagePaint,
	TPaint
} from '@repo/editor';

/**
 * Extracts asset hashes from an about node
 */
export function getAboutNodeAssetHashes(node: TAboutNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Profile picture asset
	if (node.content.profilePicture != null) {
		hashes.push(node.content.profilePicture);
	}

	// Font asset (if not inherited)
	if (node.text?.typography?.font != null && !isInherited(node.text.typography.font)) {
		hashes.push(getFontHash(node.text.typography.font as TFont));
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
