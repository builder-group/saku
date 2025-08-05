import { getFontHash, isInheritedStyle, TAssetHash, TLinkNode } from '@repo/editor';

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
	if (node.style?.font != null && !isInheritedStyle(node.style.font)) {
		hashes.push(getFontHash(node.style.font));
	}

	return hashes;
}
