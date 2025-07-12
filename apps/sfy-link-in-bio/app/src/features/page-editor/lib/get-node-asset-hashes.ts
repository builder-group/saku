import { getFontHash, isInheritedStyle, TAssetHash, TNode } from '@repo/editor';
import { TFlattenedNode } from './flatten-node';

/**
 * Extracts all asset hashes referenced by a node
 */
export function getNodeAssetHashes(node: TFlattenedNode<TNode> | TNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	switch (node.type) {
		case 'about': {
			// Profile picture asset
			if (node.content.profilePicture != null) {
				hashes.push(node.content.profilePicture);
			}

			// Font asset (if not inherited)
			if (node.style?.font != null && !isInheritedStyle(node.style.font)) {
				hashes.push(getFontHash(node.style.font));
			}
			break;
		}

		case 'link': {
			// Favicon asset
			if (node.content.userMetadata?.favicon != null) {
				hashes.push(node.content.userMetadata.favicon);
			}

			// Font asset (if not inherited)
			if (node.style?.font != null && !isInheritedStyle(node.style.font)) {
				hashes.push(getFontHash(node.style.font));
			}
			break;
		}

		case 'text': {
			// Font asset (if not inherited)
			if (node.style?.font != null && !isInheritedStyle(node.style.font)) {
				hashes.push(getFontHash(node.style.font));
			}
			break;
		}

		case 'media': {
			// Media asset (always present)
			if (node.content.media?.hash != null) {
				hashes.push(node.content.media.hash);
			}
			break;
		}

		case 'page': {
			// Default font for children (not inherited, direct value)
			if (node.style?.children?.font != null) {
				hashes.push(getFontHash(node.style.children.font));
			}
			break;
		}
	}

	return hashes;
}
