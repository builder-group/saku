import { notEmpty } from '@blgc/utils';
import { TProduct, TSingleProductNodeContentMixin } from '@repo/editor';
import { Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveAsset, TMixinResolveContext } from '../../lib';
import { TResolvedProduct, TResolvedSingleProductNodeContentMixin } from './types';

export function resolveSingleProductNodeContentMixin(
	content: TSingleProductNodeContentMixin['value'],
	cx: TMixinResolveContext
): TResult<TResolvedSingleProductNodeContentMixin['value'], AppError> {
	let resolvedProduct: TResolvedProduct | undefined;
	if (content.product != null) {
		resolvedProduct = resolveProduct(content.product, cx);
	}

	return Ok({
		...content,
		product: resolvedProduct
	});
}

export function resolveProduct(product: TProduct, cx: TMixinResolveContext): TResolvedProduct {
	const variants = product.variants
		.map((variant) => ({
			...variant,
			image: variant.image != null ? resolveAsset(variant.image, cx.node.site) : undefined
		}))
		.filter(notEmpty);

	return {
		id: product.id,
		title: product.title,
		description: product.description,
		images: product.images.map((asset) => resolveAsset(asset, cx.node.site)).filter(notEmpty),
		options: product.options,
		variants
	};
}
