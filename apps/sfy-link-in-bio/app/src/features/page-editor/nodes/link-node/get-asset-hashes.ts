import {
	getFontHash,
	isInherited,
	TAssetHash,
	TFont,
	TImagePaint,
	TLinkNode,
	TPaint
} from '@repo/editor';

/**
 * Extracts asset hashes from a link node
 */
export function getLinkNodeAssetHashes(node: TLinkNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	switch (node.content.variant.type) {
		case 'default': {
			if (node.content.variant.userFavicon != null) {
				hashes.push(node.content.variant.userFavicon);
			}
			if (node.content.variant.favicon != null) {
				hashes.push(node.content.variant.favicon);
			}
			break;
		}
		default:
		// do nothing
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
