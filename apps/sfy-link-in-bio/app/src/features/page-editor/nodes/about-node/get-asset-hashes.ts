import { getFontHash, isInherited, TAboutNode, TAssetHash } from '@repo/editor';

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
		hashes.push(getFontHash(node.text.typography.font));
	}

	// Fill asset (if not inherited)
	if (
		node.fill != null &&
		!isInherited(node.fill) &&
		node.fill.paint.type === 'image' &&
		node.fill.paint.hash != null
	) {
		hashes.push(node.fill.paint.hash);
	}

	return hashes;
}
