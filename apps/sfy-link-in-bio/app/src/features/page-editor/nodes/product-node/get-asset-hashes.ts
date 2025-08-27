import { notEmpty } from '@blgc/utils';
import {
	getFontHash,
	isTokenRef,
	TAssetHash,
	TImagePaint,
	TPaint,
	TProductNode
} from '@repo/editor';

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
	if (!isTokenRef(node.text.typography) && !isTokenRef(node.text.typography.font)) {
		hashes.push(getFontHash(node.text.typography.font));
	}

	// Fill asset (if not inherited)
	if (
		node.fill != null &&
		(node.fill as { paint: TPaint }).paint.type === 'image' &&
		(node.fill as { paint: TImagePaint }).paint.hash != null
	) {
		hashes.push((node.fill as { paint: TImagePaint }).paint.hash as TAssetHash);
	}

	return hashes;
}
