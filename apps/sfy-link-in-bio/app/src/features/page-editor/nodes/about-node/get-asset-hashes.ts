import { getFontHash, isInheritedStyle, TAboutNode, TAssetHash } from '@repo/editor';

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
	if (node.style?.font != null && !isInheritedStyle(node.style.font)) {
		hashes.push(getFontHash(node.style.font));
	}

	return hashes;
}
