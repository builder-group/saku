import { notEmpty } from '@blgc/utils';
import { getFontHash, isInherited, TAssetHash, TProductNode } from '@repo/editor';

/**
 * Extracts asset hashes from a product node
 */
export function getProductNodeAssetHashes(node: TProductNode): TAssetHash[] {
	const hashes: TAssetHash[] = [];

	// Product media assets
	if (node.content.product?.images != null) {
		hashes.push(...node.content.product.images.map((media) => media));
	}

	// Product variant images
	if (node.content.product?.variants != null) {
		hashes.push(...node.content.product.variants.map((variant) => variant.image).filter(notEmpty));
	}

	// Font asset (if not inherited)
	if (node.typography?.font != null && !isInherited(node.typography.font)) {
		hashes.push(getFontHash(node.typography.font));
	}

	return hashes;
}
