import React from 'react';
import { getCurrencySymbol } from '../../../../environment';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedProductNode } from '../../types';

export const ProductModal: React.FC<TProductModalProps> = (props) => {
	const { product, cx, modalRef } = props;

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
			console.error('Failed to buy now:', result.error);
			setIsBuying(false);
			return;
		}

		window.open(result.value.checkoutUrl, '_blank', 'noopener');
		setIsBuying(false);
	}, [selectedVariant?.id, cx.integrations.shopify]);

	return (
		<dialog ref={modalRef} className="modal">
			<div className="modal-box max-w-4xl">
				{/* Modal Header */}
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-bold">Product Details</h3>
					<form method="dialog">
						<button className="btn btn-sm btn-circle btn-ghost">✕</button>
					</form>
				</div>

				{/* Modal Content */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Product Images */}
					<div className="space-y-4">
						{/* Main Image */}
						<div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
							{selectedImage && (
								<img
									src={selectedImage.src}
									alt={product.title}
									className="h-full w-full object-cover"
								/>
							)}
						</div>

						{/* Image Thumbnails */}
						{product.images && product.images.length > 1 && (
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
						<h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>

						{/* Price */}
						{selectedVariant?.price && (
							<p className="text-2xl font-semibold text-gray-900">
								{getCurrencySymbol(selectedVariant.price.currencyCode)}
								{selectedVariant.price.amount}
							</p>
						)}

						{/* Description */}
						{product.description?.type === 'html' && (
							<div
								className="prose prose-sm text-gray-700"
								dangerouslySetInnerHTML={{ __html: product.description.value }}
							/>
						)}
						{product.description?.type === 'text' && (
							<div className="prose prose-sm text-gray-700">
								<p className="text-gray-700">{product.description.value}</p>
							</div>
						)}

						{/* Product Options */}
						{product.options?.map((option) => {
							const currentValue = selectedOptions[option.name];

							return (
								<div key={option.name} className="form-control">
									<label className="label">
										<span className="label-text font-medium">{option.name}</span>
									</label>
									<select
										value={currentValue}
										onChange={(e) => handleOptionSelect(option.name, e.target.value)}
										className="select select-bordered w-full"
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
							<button onClick={handleBuyNow} disabled={isBuying} className="btn btn-primary w-full">
								{isBuying ? (
									<span className="loading loading-spinner loading-sm"></span>
								) : (
									'Buy Now'
								)}
							</button>
						)}
					</div>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
};

interface TProductModalProps {
	product: NonNullable<TResolvedProductNode['content']['product']>;
	cx: TResolvedNodeProps<TResolvedProductNode>['cx'];
	modalRef: React.RefObject<HTMLDialogElement>;
}

export function useProductModal(config: TUseProductModalConfig) {
	const { product, cx, onShow, onHide } = config;
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
		return <ProductModal product={product} cx={cx} modalRef={modalRef} />;
	}, [product, cx]);

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

interface TUseProductModalConfig {
	product: NonNullable<TResolvedProductNode['content']['product']>;
	cx: TResolvedNodeProps<TResolvedProductNode>['cx'];
	onShow?: () => void;
	onHide?: () => void;
}
