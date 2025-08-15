import { getFontHash, isInherited, TAssetHash, TLinkNode } from '@repo/editor';

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
	if (node.typography?.font != null && !isInherited(node.typography.font)) {
		hashes.push(getFontHash(node.typography.font));
	}

	return hashes;
}
