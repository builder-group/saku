import { getFontHash, isTokenRef, TAboutNode, TAssetHash } from '@repo/editor';

/**
 * Extracts asset hashes from an about node
 */
export function getAboutNodeAssetHashes(node: TAboutNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Avatar asset
	if (node.content.avatar != null) {
		hashes.push(node.content.avatar);
	}

	// Font asset (if not linked)
	if (
		!isTokenRef(node.textHeading) &&
		!isTokenRef(node.textHeading.typography) &&
		!isTokenRef(node.textHeading.typography.font)
	) {
		hashes.push(getFontHash(node.textHeading.typography.font));
	}
	if (
		!isTokenRef(node.textBody) &&
		!isTokenRef(node.textBody.typography) &&
		!isTokenRef(node.textBody.typography.font)
	) {
		hashes.push(getFontHash(node.textBody.typography.font));
	}

	// Fill asset (if not linked)
	if (!isTokenRef(node.fill) && node.fill?.paint.type === 'image' && node.fill.paint.hash != null) {
		hashes.push(node.fill.paint.hash);
	}

	return hashes;
}
