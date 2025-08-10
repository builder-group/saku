import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@/components';
import { getCurrencySymbol } from '../../../../environment';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedProductNode } from '../../../../types';

export const Content: React.FC<TContentProps> = (props) => {
	const { product, style, cx } = props;

	// const [isAdding, setIsAdding] = React.useState(false);
	const [isBuying, setIsBuying] = React.useState(false);
	const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

	const imageUrl = React.useMemo(() => product.images?.[0], [product.images]);

	// Get currently selected variant (default to first)
	const selectedVariant = React.useMemo(
		() => product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0],
		[product.variants, selectedVariantId]
	);

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
			console.error('Failed to buy now:', result.error);
			setIsBuying(false);
			return;
		}

		window.open(result.value.checkoutUrl, '_blank', 'noopener');
		setIsBuying(false);
	}, [selectedVariant?.id, cx.integrations.shopify]);

	const handleVariantSelect = React.useCallback((variantId: string) => {
		setSelectedVariantId(variantId);
		// Blur to close dropdown
		(document.activeElement as HTMLElement)?.blur();
	}, []);

	return (
		<div
			className="relative flex w-full items-center gap-3 bg-white"
			style={{
				padding: style.padding,
				backgroundColor: style.backgroundColor,
				fontFamily: style.font?.family,
				fontSize: style.fontSize,
				color: style.textColor,
				borderRadius: style.borderRadius,
				boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
			}}
		>
			{/* Product Image */}
			{imageUrl != null && (
				<div
					className="h-12 w-12 flex-shrink-0 overflow-hidden bg-gray-100"
					style={{ borderRadius: style.borderRadius }}
				>
					<img src={imageUrl} alt={product.title} className="h-full w-full object-cover" />
				</div>
			)}

			{/* Product Details */}
			<div className="flex min-w-0 flex-grow items-center justify-between">
				<div className="flex min-w-0 flex-col justify-center gap-1">
					<p className="truncate font-medium">{product.title}</p>

					{/* Price and Variant Badges */}
					<div className="flex items-center gap-2">
						{/* Price Badge */}
						{selectedVariant?.price && (
							<div
								className="badge badge-neutral badge-sm"
								style={{ borderRadius: style.borderRadius }}
							>
								{getCurrencySymbol(selectedVariant.price.currencyCode)}
								{selectedVariant.price.amount}
							</div>
						)}

						{/* Variant Badge/Dropdown */}
						{product.variants?.length > 1 ? (
							<div className="dropdown">
								<div
									tabIndex={0}
									role="button"
									className="badge badge-ghost badge-sm flex cursor-pointer items-center gap-1"
									style={{ borderRadius: style.borderRadius }}
									onFocus={() => setIsDropdownOpen(true)}
									onBlur={() => setIsDropdownOpen(false)}
								>
									<span>{selectedVariant?.title || 'Select variant'}</span>
									{isDropdownOpen ? (
										<ChevronUpIcon className="h-3 w-3" />
									) : (
										<ChevronDownIcon className="h-3 w-3" />
									)}
								</div>
								<ul
									tabIndex={0}
									className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow"
								>
									{product.variants.map((variant) => (
										<li key={variant.id}>
											<a
												onClick={(e) => {
													e.preventDefault();
													handleVariantSelect(variant.id);
												}}
												className={selectedVariant?.id === variant.id ? 'active' : ''}
											>
												{variant.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						) : (
							selectedVariant?.title != null && (
								<div
									className="badge badge-ghost badge-sm"
									style={{ borderRadius: style.borderRadius }}
								>
									{selectedVariant.title}
								</div>
							)
						)}
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
						onClick={handleBuyNow}
						disabled={isBuying}
						className="btn btn-sm ml-3 text-white"
						style={{
							backgroundColor: '#000',
							borderColor: '#000',
							borderRadius: style.borderRadius
						}}
					>
						{isBuying ? <span className="loading loading-spinner loading-xs"></span> : 'Buy'}
					</button>
				)}
			</div>
		</div>
	);
};

interface TContentProps {
	product: NonNullable<TResolvedProductNode['content']['product']>;
	style: TResolvedProductNode['style'];
	cx: TResolvedNodeProps<TResolvedProductNode>['cx'];
}
