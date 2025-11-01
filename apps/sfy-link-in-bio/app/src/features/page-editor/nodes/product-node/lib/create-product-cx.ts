import { createState, TState } from 'feature-state';
import { logger } from '@/environment';
import { TPageContext } from '../../../lib';
import { TResolvedProduct, TResolvedProductVariant } from '../../../mixins';
import { TResolvedProductNode } from '../types';

export function createProductCx(config: TCreateProductCxConfig): TProductCx {
	const { pageCx, node, product } = config;

	const selectedOptions = createState(getInitialSelectedOptions(product));

	return {
		pageCx,
		node,
		product,
		isProcessing: createState(false),
		selectedOptions,
		selectedVariant: createState(getSelectedVariant(product, selectedOptions._v)),

		selectOption(name, value) {
			this.selectedOptions.set((prev) => ({
				...prev,
				[name]: value
			}));
			this.selectedVariant.set(getSelectedVariant(product, this.selectedOptions._v));
		},

		async addToCart() {
			const variant = this.selectedVariant._v;
			if (variant?.id == null || pageCx.integrations.shopify == null) {
				return;
			}

			this.isProcessing.set(true);

			const [isAddToCartOk, isAddToCartError] = await pageCx.integrations.shopify.addToCart([
				{
					merchandiseId: variant.id,
					quantity: 1
				}
			]);
			if (!isAddToCartOk) {
				logger.error('Failed to add to cart', { error: isAddToCartError });
				this.isProcessing.set(false);
				return;
			}

			this.isProcessing.set(false);
		},

		async buyNow() {
			const variant = this.selectedVariant._v;
			if (variant?.id == null || pageCx.integrations.shopify == null) {
				return;
			}

			this.isProcessing.set(true);

			const [isBuyNowOk, isBuyNowError, buyNowData] = await pageCx.integrations.shopify.buyNow([
				{
					merchandiseId: variant.id,
					quantity: 1
				}
			]);
			if (!isBuyNowOk) {
				logger.error('Failed to buy now', { error: isBuyNowError });
				this.isProcessing.set(false);
				return;
			}

			// Use '_top' instead of '_blank' to avoid Safari's strict popup blocking in async contexts
			window.open(buyNowData.checkoutUrl, '_top');
			this.isProcessing.set(false);
		}
	};
}

export interface TCreateProductCxConfig {
	pageCx: TPageContext;
	node: TResolvedProductNode;
	product: TResolvedProduct;
}

export interface TProductCx {
	pageCx: TPageContext;
	node: TResolvedProductNode;
	product: TResolvedProduct;
	isProcessing: TState<boolean, []>;
	selectedOptions: TState<Record<string, string>, []>;
	selectedVariant: TState<TResolvedProductVariant | null, []>;
	selectOption: (name: string, value: string) => void;
	addToCart: () => Promise<void>;
	buyNow: () => Promise<void>;
}

function getSelectedVariant(
	product: TResolvedProduct,
	selectedOptions: Record<string, string>
): TResolvedProductVariant | null {
	if (!product.variants?.length) {
		return null;
	}

	return (
		product.variants.find((variant) =>
			variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value)
		) ??
		product.variants[0] ??
		null
	);
}

function getInitialSelectedOptions(product: TResolvedProduct): Record<string, string> {
	if (!product.variants?.[0]) {
		return {};
	}

	const initialOptions: Record<string, string> = {};
	product.variants[0].selectedOptions.forEach((option) => {
		initialOptions[option.name] = option.value;
	});
	return initialOptions;
}
