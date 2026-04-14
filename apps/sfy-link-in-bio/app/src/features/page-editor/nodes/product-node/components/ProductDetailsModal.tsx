import { useFeatureState } from 'feature-react';
import React from 'react';
import { cn } from '@/lib';
import { getCurrencySymbol } from '../../../environment';
import { isDefaultShopifyOption, TProductCx } from '../lib';

export const ProductDetailsModal: React.FC<TProductDetailsModalProps> = (props) => {
	const { cx, modalRef } = props;

	const { appearance, fill, stroke, shadow, textHeading, textBody, buttonPrimary, image } =
		cx.node.productDetails;
	const ctaLabel = cx.node.content.cta.label;

	const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
	const isProcessing = useFeatureState(cx.isProcessing);
	const selectedOptions = useFeatureState(cx.selectedOptions);
	const selectedVariant = useFeatureState(cx.selectedVariant);

	const selectedImage = React.useMemo(
		() => cx.product.images?.[selectedImageIndex] || cx.product.images?.[0],
		[cx.product.images, selectedImageIndex]
	);
	const canBuyNow = React.useMemo(
		() => cx.pageCx.integrations.shopify != null && selectedVariant != null,
		[cx.pageCx.integrations.shopify, selectedVariant]
	);
	const buyButtonLabel = React.useMemo(
		() => (ctaLabel.trim().length > 0 ? ctaLabel : 'Buy Now'),
		[ctaLabel]
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleOptionSelect = React.useCallback(
		(optionName: string, optionValue: string) => {
			cx.selectOption(optionName, optionValue);
		},
		[cx]
	);

	const handleBuyNow = React.useCallback(async () => {
		cx.pageCx.integrations.tracking.trackEvent({
			name: 'product_cta_click',
			ga4EventName: 'add_to_cart',
			metaPixelEventName: 'AddToCart',
			properties: {
				site_id: cx.pageCx.id,
				site_handle: cx.pageCx.handle,
				page_url: typeof window !== 'undefined' ? window.location.href : cx.pageCx.url.platform,
				node_id: cx.node.id,
				node_type: cx.node.type,
				product_id: cx.product.id,
				product_title: cx.product.title,
				cta_action_type: 'product-direct-buy',
				source: 'modal'
			}
		});
		await cx.buyNow();
	}, [cx]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
			<div
				className={cn(
					'modal-box flex flex-col p-0 sm:max-w-7xl',
					appearance.styles.borderRadius != null &&
						'rounded-t-(--border-radius) sm:rounded-(--border-radius)'
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
					<button className="btn btn-sm btn-circle absolute top-4 right-4 z-50 bg-neutral-100 text-gray-700 hover:bg-neutral-200">
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
								className="aspect-square w-full overflow-hidden bg-neutral-100"
								style={{
									...image.appearance.styles,
									...image.stroke?.styles,
									...image.shadow?.styles
								}}
							>
								{selectedImage != null && (
									<img
										src={selectedImage.src}
										alt={cx.product.title}
										className="h-full w-full object-cover"
									/>
								)}
							</div>

							{/* Image Thumbnails */}
							{cx.product.images.length > 1 && (
								<div className="grid grid-cols-4 gap-2">
									{cx.product.images.map((img, index) => (
										<button
											key={index}
											onClick={() => setSelectedImageIndex(index)}
											className={`aspect-square overflow-hidden rounded-md bg-neutral-100 ${
												index === selectedImageIndex
													? 'ring-primary ring-2 ring-offset-2'
													: 'hover:opacity-75'
											}`}
										>
											<img
												src={img.src}
												alt={`${cx.product.title} ${index + 1}`}
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
							<h1 className="font-bold" style={textHeading.styles}>
								{cx.product.title}
							</h1>

							{/* Price */}
							{selectedVariant?.price != null && (
								<p
									className="font-semibold"
									style={{
										...textHeading.styles,
										fontSize: textHeading.typography.fontSize * 0.875
									}}
								>
									{getCurrencySymbol(selectedVariant.price.currencyCode)}
									{selectedVariant.price.amount}
								</p>
							)}

							{/* Description */}
							{cx.product.description?.type === 'html' && (
								<div
									className="prose prose-sm"
									style={textBody.styles}
									dangerouslySetInnerHTML={{ __html: cx.product.description.value }}
								/>
							)}
							{cx.product.description?.type === 'text' && (
								<div className="prose prose-sm" style={textBody.styles}>
									<p>{cx.product.description.value}</p>
								</div>
							)}

							{/* Product Options */}
							{cx.product.options?.map((option) => {
								if (isDefaultShopifyOption(option)) {
									return null;
								}

								const currentValue = selectedOptions[option.name];

								return (
									<div key={option.name} className="form-control">
										<label className="label">
											<span
												className="label-text font-medium"
												style={{ color: textBody.styles.color }}
											>
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
							{canBuyNow && (
								<button
									onClick={handleBuyNow}
									disabled={isProcessing}
									className="w-full py-2"
									style={{
										...buttonPrimary.appearance.styles,
										...buttonPrimary.fill?.styles,
										...buttonPrimary.stroke?.styles,
										...buttonPrimary.shadow?.styles
									}}
								>
									<div style={buttonPrimary.text.styles}>
										{isProcessing ? (
											<span className="loading loading-spinner loading-sm"></span>
										) : (
											buyButtonLabel
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
	cx: TProductCx;
	modalRef: React.RefObject<HTMLDialogElement>;
}

export function useProductDetailsModal(config: TUseProductDetailsModalConfig) {
	const { cx, onShow, onHide } = config;
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
		return <ProductDetailsModal cx={cx} modalRef={modalRef} />;
	}, [cx]);

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
	cx: TProductCx;
	onShow?: () => void;
	onHide?: () => void;
}
