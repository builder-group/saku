import { notEmpty } from '@blgc/utils';
import { TAssetHash, TProductNode } from '@repo/editor';

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

	return hashes;
}
