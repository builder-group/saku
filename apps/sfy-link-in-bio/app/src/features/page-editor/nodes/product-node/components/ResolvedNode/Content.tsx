import React from 'react';
import { ChevronDownIcon } from '@/components';
import { getCurrencySymbol } from '../../../../environment';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedProductNode } from '../../types';

export const Content: React.FC<TContentProps> = (props) => {
	const {
		product,
		node: { layout, appearance, typography, fill, stroke, shadow },
		cx
	} = props;

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

	const image = React.useMemo(() => product.images?.[0], [product.images]);

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

	const handleOptionSelect = React.useCallback((optionName: string, optionValue: string) => {
		setSelectedOptions((prev) => ({
			...prev,
			[optionName]: optionValue
		}));
		// Blur to close dropdown
		(document.activeElement as HTMLElement)?.blur();
	}, []);

	return (
		<div
			className="relative flex w-full items-center gap-3 bg-white"
			style={{
				...layout.styles,
				...appearance.styles,
				...typography.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			{/* Product Image */}
			{image != null && (
				<div
					className="h-12 w-12 flex-shrink-0 overflow-hidden bg-gray-100"
					style={{ borderRadius: appearance.styles.borderRadius }}
				>
					<img src={image.src} alt={product.title} className="h-full w-full object-cover" />
				</div>
			)}

			{/* Product Details */}
			<div className="flex min-w-0 flex-grow items-center justify-between">
				<div className="flex min-w-0 flex-col justify-center gap-1">
					<p className="truncate font-medium">{product.title}</p>

					{/* Price and Option Badges */}
					<div className="flex flex-wrap items-center gap-2">
						{/* Price Badge */}
						{selectedVariant?.price && (
							<div
								className="badge badge-neutral badge-sm"
								style={{ borderRadius: appearance.styles.borderRadius }}
							>
								{getCurrencySymbol(selectedVariant.price.currencyCode)}
								{selectedVariant.price.amount}
							</div>
						)}

						{/* Option Dropdowns */}
						{product.options?.map((option) => {
							const currentValue = selectedOptions[option.name];
							const placeholderText = React.useMemo(
								() =>
									`Pick ${option.name.slice(0, 1).toUpperCase()}${option.name.toLowerCase().slice(1)}`,
								[option.name]
							);

							return (
								<div key={option.name} className="relative">
									<select
										value={currentValue}
										onChange={(e) => handleOptionSelect(option.name, e.target.value)}
										className="select absolute inset-0 h-full w-full cursor-pointer opacity-0"
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
										className="badge badge-ghost badge-sm pointer-events-none flex max-w-24 cursor-pointer items-center gap-1"
										style={{ borderRadius: appearance.styles.borderRadius }}
									>
										<span className="truncate">{currentValue || placeholderText}</span>
										<ChevronDownIcon className="h-3 w-3 flex-shrink-0" />
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
						onClick={handleBuyNow}
						disabled={isBuying}
						className="btn btn-sm ml-3 text-white"
						style={{
							backgroundColor: '#000',
							borderColor: '#000',
							borderRadius: appearance.styles.borderRadius
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
	node: TResolvedProductNode;
	cx: TResolvedNodeProps<TResolvedProductNode>['cx'];
}
