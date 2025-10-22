import React from 'react';
import { ChevronDownIcon } from '@/components';
import { logger } from '@/environment';
import { getCurrencySymbol } from '../../../../../environment';
import { TResolvedNodeProps } from '../../../../../lib';
import { TResolvedSingleProductNodeContentMixin } from '../../../../../mixins';
import { TResolvedClassicProductNodeBundle } from '../../../types';
import { useProductDetailsModal } from './ProductDetailsModal';

export const ResolvedClassicBundle = React.forwardRef<HTMLDivElement, TResolvedClassicBundleProps>(
	(props, ref) => {
		const { node, product, cx } = props;
		const {
			autoLayout,
			appearance,
			fill,
			stroke,
			shadow,
			textBody,
			buttonPrimary,
			badgeSecondary,
			badgeNeutral,
			image
		} = node;

		const { Modal: ProductDetailsModal, showModal: showProductDetailsModal } =
			useProductDetailsModal({
				product,
				node,
				cx
			});

		// const [isAdding, setIsAdding] = React.useState(false);
		const [isBuying, setIsBuying] = React.useState(false);
		const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>(() => {
			if (!product.variants?.[0]) {
				return {};
			}

			const initialOptions: Record<string, string> = {};
			product.variants[0].selectedOptions.forEach((option) => {
				initialOptions[option.name] = option.value;
			});
			return initialOptions;
		});

		const productImage = React.useMemo(() => product.images?.[0], [product.images]);

		const selectedVariant = React.useMemo(() => {
			if (!product.variants?.length) {
				return null;
			}

			// Find variant that matches selected options
			return (
				product.variants.find((variant) =>
					variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value)
				) || product.variants[0]
			);
		}, [product.variants, selectedOptions]);

		// =========================================================================
		// Events
		// =========================================================================

		// const handleAddToCart = React.useCallback(async () => {
		// 	if (selectedVariant?.id == null || cx.integrations.shopify == null) {
		// 		return;
		// 	}

		// 	setIsAdding(true);

		// 	const result = await cx.integrations.shopify.addToCart([
		// 		{
		// 			merchandiseId: selectedVariant.id,
		// 			quantity: 1
		// 		}
		// 	]);
		// 	if (result.isErr()) {
		// 		console.error('Failed to add to cart:', result.error);
		// 	}

		// 	setIsAdding(false);
		// }, [selectedVariant?.id, cx.integrations.shopify]);

		const handleBuyNow = React.useCallback(async () => {
			if (selectedVariant?.id == null || cx.integrations.shopify == null) {
				return;
			}

			setIsBuying(true);

			const result = await cx.integrations.shopify.buyNow([
				{
					merchandiseId: selectedVariant.id,
					quantity: 1
				}
			]);
			if (result.isErr()) {
				logger.warn('Failed to buy now:', {
					error: result.error
				});
				setIsBuying(false);
				return;
			}

			// Use '_top' instead of '_blank' to avoid Safari's strict popup blocking in async contexts
			window.open(result.value.checkoutUrl, '_top');
			setIsBuying(false);
		}, [selectedVariant?.id, cx.integrations.shopify]);

		const handleOptionSelect = React.useCallback((optionName: string, optionValue: string) => {
			setSelectedOptions((prev) => ({
				...prev,
				[optionName]: optionValue
			}));
			// Blur to close dropdown
			(document.activeElement as HTMLElement)?.blur();
		}, []);

		const handleProductClick = React.useCallback(() => {
			showProductDetailsModal();
		}, [showProductDetailsModal]);

		// =========================================================================
		// UI
		// =========================================================================

		return (
			<>
				<div
					ref={ref}
					onClick={handleProductClick}
					style={{
						...autoLayout.styles,
						...appearance.styles,
						...fill?.styles,
						...stroke?.styles,
						...shadow?.styles
					}}
					className="flex min-h-16 flex-row items-center gap-2"
				>
					{/* Product Image */}
					{productImage != null && (
						<div
							className="h-12 w-12 flex-shrink-0 overflow-hidden bg-neutral-100"
							style={image.styles}
						>
							<img
								src={productImage.src}
								alt={product.title}
								className="h-full w-full object-cover"
								draggable={false}
							/>
						</div>
					)}

					{/* Product Details */}
					<div className="flex min-w-0 flex-grow items-center justify-between">
						<div className="flex min-w-0 flex-col justify-center gap-1">
							{/* Title */}
							<p className="truncate font-medium" style={textBody.styles}>
								{product.title}
							</p>

							{/* Price and Option Badges */}
							<div className="flex flex-wrap items-center gap-2">
								{/* Price Badge */}
								{selectedVariant?.price && (
									<div className="px-2 py-0.5" style={badgeSecondary.styles}>
										<div style={badgeSecondary.text.styles}>
											{getCurrencySymbol(selectedVariant.price.currencyCode)}
											{selectedVariant.price.amount}
										</div>
									</div>
								)}

								{/* Option Dropdowns */}
								{product.options?.map((option) => {
									const currentValue = selectedOptions[option.name];
									const placeholderText = `Pick ${option.name.slice(0, 1).toUpperCase()}${option.name.toLowerCase().slice(1)}`;
									const selectId = `product-option-${option.name.toLowerCase().replace(/\s+/g, '-')}`;

									return (
										<div
											key={option.name}
											className="relative"
											onClick={(e) => e.stopPropagation()}
										>
											<label htmlFor={selectId} className="sr-only">
												Select {option.name}
											</label>
											<select
												id={selectId}
												value={currentValue}
												onChange={(e) => handleOptionSelect(option.name, e.target.value)}
												className="select absolute inset-0 h-full w-full cursor-pointer opacity-0"
												aria-label={`Select ${option.name}`}
											>
												<option disabled value="">
													{placeholderText}
												</option>
												{option.values.map((value) => (
													<option key={value} value={value}>
														{value}
													</option>
												))}
											</select>
											<div
												className="pointer-events-none flex max-w-24 cursor-pointer items-center gap-1 px-2 py-0.5"
												style={badgeNeutral.styles}
											>
												<span className="truncate" style={badgeNeutral.text.styles}>
													{currentValue || placeholderText}
												</span>
												<ChevronDownIcon
													className="h-3 w-3 flex-shrink-0"
													style={{ color: badgeNeutral.text.styles?.color }}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Add to Cart Button */}
						{/* {cx.integrations.shopify != null && selectedVariant != null && (
					<button
						onClick={handleAddToCart}
						disabled={isAdding}
						className="btn btn-sm ml-3 text-white"
						style={{
							backgroundColor: '#000',
							borderColor: '#000',
							borderRadius: style.borderRadius
						}}
					>
						{isAdding ? <span className="loading loading-spinner loading-xs"></span> : 'Add'}
					</button>
				)} */}

						{/* Buy Now Button */}
						{cx.integrations.shopify != null && selectedVariant != null && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleBuyNow();
								}}
								disabled={isBuying}
								className="ml-3 cursor-pointer px-3 py-1.5"
								style={buttonPrimary.styles}
							>
								<div style={buttonPrimary.text.styles}>
									{isBuying ? <span className="loading loading-spinner loading-xs"></span> : 'Buy'}
								</div>
							</button>
						)}
					</div>
				</div>

				<ProductDetailsModal />
			</>
		);
	}
);
ResolvedClassicBundle.displayName = 'ResolvedClassicBundle';

interface TResolvedClassicBundleProps {
	node: TResolvedClassicProductNodeBundle;
	product: NonNullable<TResolvedSingleProductNodeContentMixin['value']['product']>;
	cx: TResolvedNodeProps<TResolvedClassicProductNodeBundle>['cx'];
}
