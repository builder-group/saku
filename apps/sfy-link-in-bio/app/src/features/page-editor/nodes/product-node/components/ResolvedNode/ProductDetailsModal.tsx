import React from 'react';
import { logger } from '@/environment';
import { cn } from '@/lib';
import { getCurrencySymbol } from '../../../../environment';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedProductNode } from '../../types';

export const ProductDetailsModal: React.FC<TProductDetailsModalProps> = (props) => {
	const {
		product,
		node: { productDetails },
		cx,
		modalRef
	} = props;

	const { appearance, fill, stroke, shadow, textXl, text, buttonPrimary, image } = productDetails;

	const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
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

	const selectedImage = React.useMemo(
		() => product.images?.[selectedImageIndex] || product.images?.[0],
		[product.images, selectedImageIndex]
	);

	const selectedVariant = React.useMemo(() => {
		if (!product.variants?.length) {
			return null;
		}

		return (
			product.variants.find((variant) =>
				variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value)
			) || product.variants[0]
		);
	}, [product.variants, selectedOptions]);

	const handleOptionSelect = React.useCallback((optionName: string, optionValue: string) => {
		setSelectedOptions((prev) => ({
			...prev,
			[optionName]: optionValue
		}));
	}, []);

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

	return (
		<dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
			<div
				className={cn(
					'modal-box flex flex-col p-0 sm:max-w-[80rem]',
					appearance.styles.borderRadius != null &&
						'rounded-t-[var(--border-radius)] sm:rounded-[var(--border-radius)]'
				)}
				style={{
					display: appearance.styles.display,
					// Don't set opacity as it interferes with DaisyUI modal animations
					// opacity: appearance.styles.opacity,
					...(appearance.styles.borderRadius
						? {
								'--border-radius': appearance.styles.borderRadius
							}
						: {}),
					...fill?.styles,
					...stroke?.styles,
					...shadow?.styles
				}}
			>
				{/* Modal Header */}
				<form method="dialog">
					<button className="btn btn-sm btn-circle absolute top-4 right-4 z-50 bg-gray-100 text-gray-700 hover:bg-gray-200">
						✕
					</button>
				</form>

				{/* Modal Content */}
				<div className="flex-1 overflow-y-auto p-6">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* Product Images */}
						<div className="space-y-4">
							{/* Main Image */}
							<div
								className="aspect-square w-full overflow-hidden bg-gray-100"
								style={{
									...image.appearance.styles,
									...image.stroke?.styles,
									...image.shadow?.styles
								}}
							>
								{selectedImage != null && (
									<img
										src={selectedImage.src}
										alt={product.title}
										className="h-full w-full object-cover"
									/>
								)}
							</div>

							{/* Image Thumbnails */}
							{product.images.length > 1 && (
								<div className="grid grid-cols-4 gap-2">
									{product.images.map((img, index) => (
										<button
											key={index}
											onClick={() => setSelectedImageIndex(index)}
											className={`aspect-square overflow-hidden rounded-md bg-gray-100 ${
												index === selectedImageIndex
													? 'ring-primary ring-2 ring-offset-2'
													: 'hover:opacity-75'
											}`}
										>
											<img
												src={img.src}
												alt={`${product.title} ${index + 1}`}
												className="h-full w-full object-cover"
											/>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Product Details */}
						<div className="flex flex-col space-y-4">
							{/* Title */}
							<h1 className="font-bold" style={textXl.styles}>
								{product.title}
							</h1>

							{/* Price */}
							{selectedVariant?.price != null && (
								<p
									className="font-semibold"
									style={{ ...textXl.styles, fontSize: textXl.typography.fontSize * 0.875 }}
								>
									{getCurrencySymbol(selectedVariant.price.currencyCode)}
									{selectedVariant.price.amount}
								</p>
							)}

							{/* Description */}
							{product.description?.type === 'html' && (
								<div
									className="prose prose-sm"
									style={text.styles}
									dangerouslySetInnerHTML={{ __html: product.description.value }}
								/>
							)}
							{product.description?.type === 'text' && (
								<div className="prose prose-sm" style={text.styles}>
									<p>{product.description.value}</p>
								</div>
							)}

							{/* Product Options */}
							{product.options?.map((option) => {
								const currentValue = selectedOptions[option.name];

								return (
									<div key={option.name} className="form-control">
										<label className="label">
											<span className="label-text font-medium" style={{ color: text.styles.color }}>
												{option.name}
											</span>
										</label>
										<select
											value={currentValue}
											onChange={(e) => handleOptionSelect(option.name, e.target.value)}
											className="select select-bordered w-full bg-white text-gray-900"
										>
											<option disabled value="">
												Choose {option.name}
											</option>
											{option.values.map((value) => (
												<option key={value} value={value}>
													{value}
												</option>
											))}
										</select>
									</div>
								);
							})}

							{/* Buy Button */}
							{cx.integrations.shopify != null && selectedVariant != null && (
								<button
									onClick={handleBuyNow}
									disabled={isBuying}
									className="w-full py-2"
									style={{
										...buttonPrimary.appearance.styles,
										...buttonPrimary.fill?.styles,
										...buttonPrimary.stroke?.styles,
										...buttonPrimary.shadow?.styles
									}}
								>
									<div style={buttonPrimary.text.styles}>
										{isBuying ? (
											<span className="loading loading-spinner loading-sm"></span>
										) : (
											'Buy Now'
										)}
									</div>
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
};

interface TProductDetailsModalProps {
	product: NonNullable<TResolvedProductNode['content']['product']>;
	node: TResolvedProductNode;
	cx: TResolvedNodeProps<TResolvedProductNode>['cx'];
	modalRef: React.RefObject<HTMLDialogElement>;
}

export function useProductDetailsModal(config: TUseProductDetailsModalConfig) {
	const { product, node, cx, onShow, onHide } = config;
	const modalRef = React.useRef<HTMLDialogElement>(null);

	const showModal = React.useCallback(() => {
		if (modalRef.current != null) {
			modalRef.current.showModal();
			onShow?.();
		}
	}, [onShow]);

	const hideModal = React.useCallback(() => {
		if (modalRef.current != null) {
			modalRef.current.close();
			onHide?.();
		}
	}, [onHide]);

	const ModalComponent = React.useCallback(() => {
		return <ProductDetailsModal product={product} node={node} cx={cx} modalRef={modalRef} />;
	}, [product, node, cx]);

	return React.useMemo(
		() => ({
			Modal: ModalComponent,
			showModal,
			hideModal,
			modalRef
		}),
		[ModalComponent, showModal, hideModal]
	);
}

interface TUseProductDetailsModalConfig {
	product: NonNullable<TResolvedProductNode['content']['product']>;
	node: TResolvedProductNode;
	cx: TResolvedNodeProps<TResolvedProductNode>['cx'];
	onShow?: () => void;
	onHide?: () => void;
}
