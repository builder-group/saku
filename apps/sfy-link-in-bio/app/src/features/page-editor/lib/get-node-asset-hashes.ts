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
			if (node.profilePicture) {
				hashes.push(node.profilePicture);
			}

			// Font asset (if not inherited)
			if (node.style?.font && !isInheritedStyle(node.style.font)) {
				hashes.push(getFontHash(node.style.font));
			}
			break;
		}

		case 'link': {
			// Favicon asset
			if (node.meta?.favicon) {
				hashes.push(node.meta.favicon);
			}

			// Font asset (if not inherited)
			if (node.style?.font && !isInheritedStyle(node.style.font)) {
				hashes.push(getFontHash(node.style.font));
			}
			break;
		}

		case 'text': {
			// Font asset (if not inherited)
			if (node.style?.font && !isInheritedStyle(node.style.font)) {
				hashes.push(getFontHash(node.style.font));
			}
			break;
		}

		case 'media': {
			// Media asset (always present)
			hashes.push(node.media.hash);
			break;
		}

		case 'page': {
			// Default font for children (not inherited, direct value)
			if (node.style?.children?.font) {
				hashes.push(getFontHash(node.style.children.font));
			}
			break;
		}
	}

	return hashes;
}
