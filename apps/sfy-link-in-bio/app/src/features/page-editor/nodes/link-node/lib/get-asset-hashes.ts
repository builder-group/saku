import { getFontHash, isTokenRef, TAssetHash, TLinkNode } from '@repo/editor';

/**
 * Extracts asset hashes from a link node
 */
export function getLinkNodeAssetHashes(node: TLinkNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Thumbnail asset
	switch (node.content.type) {
		case 'basic': {
			if (node.content.user.thumbnail != null) {
				hashes.push(node.content.user.thumbnail);
			}
			if (node.content.metadata.thumbnail != null) {
				hashes.push(node.content.metadata.thumbnail);
			}
			break;
		}
		default:
		// do nothing
	}

	// Font asset (if not linked)
	if (
		'textBody' in node &&
		!isTokenRef(node.textBody) &&
		!isTokenRef(node.textBody.typography) &&
		!isTokenRef(node.textBody.typography.font)
	) {
		hashes.push(getFontHash(node.textBody.typography.font));
	}
	if (
		'textCaption' in node &&
		!isTokenRef(node.textCaption) &&
		!isTokenRef(node.textCaption.typography) &&
		!isTokenRef(node.textCaption.typography.font)
	) {
		hashes.push(getFontHash(node.textCaption.typography.font));
	}

	// Fill asset (if not linked)
	if (
		'fill' in node &&
		!isTokenRef(node.fill) &&
		node.fill?.paint.type === 'image' &&
		node.fill.paint.hash != null
	) {
		hashes.push(node.fill.paint.hash);
	}

	return hashes;
}
