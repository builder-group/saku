import { notEmpty } from '@blgc/utils';
import { getFontHash, isInheritedStyle, TAssetHash, TFlatNode } from '@repo/editor';

/**
 * Extracts all asset hashes referenced by a node
 */
export function getNodeAssetHashes(node: TFlatNode): TAssetHash[] {
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
			// Media asset
			if (node.content.media?.hash != null) {
				hashes.push(node.content.media.hash);
			}
			break;
		}

		case 'page': {
			// Font asset
			if (node.style?.children?.font != null) {
				hashes.push(getFontHash(node.style.children.font));
			}

			// Metadata image asset
			if (node.content.metadata?.image != null) {
				hashes.push(node.content.metadata.image);
			}
			break;
		}

		case 'product': {
			// Product media assets
			if (node.content.product?.images != null) {
				hashes.push(...node.content.product.images.map((media) => media));
			}

			// Product variant images
			if (node.content.product?.variants != null) {
				hashes.push(
					...node.content.product.variants.map((variant) => variant.image).filter(notEmpty)
				);
			}
			break;
		}
	}

	return hashes;
}
