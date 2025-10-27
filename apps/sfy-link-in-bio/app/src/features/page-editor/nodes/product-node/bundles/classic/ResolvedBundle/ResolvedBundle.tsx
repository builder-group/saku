import { useFeatureState } from 'feature-react';
import React from 'react';
import { ChevronDownIcon } from '@/components';
import { getCurrencySymbol } from '../../../../../environment';
import { TResolvedNodeProps } from '../../../../../lib';
import { TResolvedSingleProductNodeContentMixin } from '../../../../../mixins';
import { TResolvedClassicProductNodeBundle } from '../../../types';
import { createBundleCx } from './create-bundle-cx';
import { useProductDetailsModal } from './ProductDetailsModal';

export const ResolvedClassicBundle = React.forwardRef<HTMLDivElement, TResolvedClassicBundleProps>(
	(props, ref) => {
		const { node, product, cx: pageCx } = props;
		const {
			content,
			autoLayout,
			appearance,
			fill,
			stroke,
			shadow,
			textBody,
			buttonPrimary,
			badgeSecondary,
			badgeNeutral,
			banner,
			image
		} = node;

		const cx = React.useMemo(
			() => createBundleCx({ pageCx, node, product }),
			[pageCx, node, product]
		);
		const isProcessing = useFeatureState(cx.isProcessing);
		const selectedOptions = useFeatureState(cx.selectedOptions);
		const selectedVariant = useFeatureState(cx.selectedVariant);

		const { Modal: ProductDetailsModal, showModal: showProductDetailsModal } =
			useProductDetailsModal({
				cx
			});

		const productImage = React.useMemo(() => product.images?.[0], [product.images]);
		const canBuyNow = React.useMemo(
			() => pageCx.integrations.shopify != null && selectedVariant != null,
			[pageCx.integrations.shopify, selectedVariant]
		);

		// =========================================================================
		// Events
		// =========================================================================

		const handleBuyNow = React.useCallback(
			async (e: React.MouseEvent<HTMLButtonElement>) => {
				e.stopPropagation();
				await cx.buyNow();
			},
			[cx]
		);

		const handleOptionSelect = React.useCallback(
			(optionName: string, optionValue: string) => {
				cx.selectOption(optionName, optionValue);

				// Note: Blur to close dropdown
				(document.activeElement as HTMLElement)?.blur();
			},
			[cx]
		);

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
					className="relative flex flex-col items-center"
					style={{ margin: autoLayout.styles.margin }}
				>
					{/* Banner */}
					{content.banner != null && (
						<div
							className="w-full px-3 pt-2 text-center"
							style={{
								...banner.styles,
								borderTopLeftRadius: appearance.styles?.borderRadius,
								borderTopRightRadius: appearance.styles?.borderRadius,
								borderBottomLeftRadius: 0,
								borderBottomRightRadius: 0,
								borderBottom: 'none', // Remove bottom border to avoid offset issues
								marginBottom: `${-(appearance.borderRadius ?? 0)}px`,
								paddingBottom: `${(appearance.borderRadius ?? 0) + 8}px`
							}}
						>
							<div style={banner.text.styles}>{content.banner.label}</div>
						</div>
					)}

					{/* Product Card */}
					<div
						onClick={handleProductClick}
						style={{
							...appearance.styles,
							...fill?.styles,
							...stroke?.styles,
							...shadow?.styles,
							padding: autoLayout.styles.padding
						}}
						className="flex min-h-16 w-full flex-row items-center gap-2"
					>
						{/* Product Image */}
						{productImage != null && (
							<div
								className="h-12 w-12 shrink-0 overflow-hidden bg-neutral-100"
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
						<div className="flex min-w-0 grow items-center justify-between">
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
														className="h-3 w-3 shrink-0"
														style={{ color: badgeNeutral.text.styles?.color }}
													/>
												</div>
											</div>
										);
									})}
								</div>
							</div>

							{/* Buy Now Button */}
							{canBuyNow && (
								<button
									onClick={handleBuyNow}
									disabled={isProcessing}
									className="ml-3 cursor-pointer px-3 py-1.5"
									style={buttonPrimary.styles}
								>
									<div style={buttonPrimary.text.styles}>
										{isProcessing ? (
											<span className="loading loading-spinner loading-xs"></span>
										) : (
											'Buy'
										)}
									</div>
								</button>
							)}
						</div>
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
