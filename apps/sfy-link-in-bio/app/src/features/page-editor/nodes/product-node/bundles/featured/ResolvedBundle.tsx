import { useFeatureState } from 'feature-react';
import React from 'react';
import { ChevronDownIcon } from '@/components';
import { getCurrencySymbol } from '../../../../environment';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedSingleProductNodeContentMixin } from '../../../../mixins';
import { useProductDetailsModal } from '../../components';
import { createProductCx, isDefaultShopifyOption } from '../../lib';
import { TResolvedFeaturedProductNodeBundle } from '../../types';

export const ResolvedFeaturedBundle = React.forwardRef<
	HTMLDivElement,
	TResolvedFeaturedBundleProps
>((props, ref) => {
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
		() => createProductCx({ pageCx, node, product }),
		[pageCx, node, product]
	);
	const isProcessing = useFeatureState(cx.isProcessing);
	const selectedOptions = useFeatureState(cx.selectedOptions);
	const selectedVariant = useFeatureState(cx.selectedVariant);

	const { Modal: ProductDetailsModal, showModal: showProductDetailsModal } = useProductDetailsModal(
		{
			cx
		}
	);

	const productImage = React.useMemo(() => product.images?.[0], [product.images]);
	const canBuyNow = React.useMemo(
		() => pageCx.integrations.shopify != null && selectedVariant != null,
		[pageCx.integrations.shopify, selectedVariant]
	);
	const ctaVisible = React.useMemo(() => content.cta.visible, [content.cta.visible]);
	const ctaLabel = React.useMemo(() => content.cta.label, [content.cta.label]);
	const ctaAction = React.useMemo(() => content.cta.action, [content.cta.action]);
	const showVariants = React.useMemo(() => content.variants.visible, [content.variants.visible]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleCtaClick = React.useCallback(
		async (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			pageCx.integrations.tracking.trackEvent({
				name: 'product_cta_click',
				metaPixelEventName: 'AddToCart',
				properties: {
					site_id: pageCx.id,
					site_handle: pageCx.handle,
					page_url: typeof window !== 'undefined' ? window.location.href : pageCx.url.platform,
					node_id: node.id,
					node_type: node.type,
					product_id: product.id,
					product_title: product.title,
					cta_action_type: ctaAction.type
				}
			});
			switch (ctaAction.type) {
				case 'product-direct-buy':
					await cx.buyNow();
					break;
				default:
				// do nothing
			}
		},
		[cx, ctaAction, node.id, node.type, pageCx, product.id, product.title]
	);

	const handleCtaLinkClick = React.useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>) => {
			e.stopPropagation();
			pageCx.integrations.tracking.trackEvent({
				name: 'product_cta_click',
				properties: {
					site_id: pageCx.id,
					site_handle: pageCx.handle,
					page_url: typeof window !== 'undefined' ? window.location.href : pageCx.url.platform,
					node_id: node.id,
					node_type: node.type,
					product_id: product.id,
					product_title: product.title,
					cta_action_type: ctaAction.type,
					destination_url: ctaAction.type === 'link' ? ctaAction.url : undefined
				}
			});
		},
		[ctaAction, node.id, node.type, pageCx, product.id, product.title]
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
		pageCx.integrations.tracking.trackEvent({
			name: 'product_detail_view',
			metaPixelEventName: 'ViewContent',
			properties: {
				site_id: pageCx.id,
				site_handle: pageCx.handle,
				page_url: typeof window !== 'undefined' ? window.location.href : pageCx.url.platform,
				node_id: node.id,
				node_type: node.type,
				product_id: product.id,
				product_title: product.title
			}
		});
		showProductDetailsModal();
	}, [node.id, node.type, pageCx, product.id, product.title, showProductDetailsModal]);

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
					className="flex w-full flex-col gap-2"
					style={{
						...appearance.styles,
						...fill?.styles,
						...stroke?.styles,
						...shadow?.styles,
						padding: autoLayout.styles.padding
					}}
				>
					{/* Product Image */}
					{productImage != null && (
						<div
							className="aspect-video w-full overflow-hidden bg-neutral-200"
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
					<div className="flex min-h-12 w-full min-w-0 items-center justify-between px-2">
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
								{showVariants &&
									product.options?.map((option) => {
										if (isDefaultShopifyOption(option)) {
											return null;
										}

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

						{/* CTA */}
						{ctaVisible && ctaAction.type === 'link' ? (
							<a
								href={ctaAction.url}
								target={ctaAction.target ?? '_self'}
								rel={ctaAction.target === '_blank' ? 'noopener noreferrer' : undefined}
								onClick={handleCtaLinkClick}
								className="ml-3 cursor-pointer px-3 py-1.5"
								style={buttonPrimary.styles}
							>
								<div style={buttonPrimary.text.styles}>{ctaLabel}</div>
							</a>
						) : (
							ctaVisible &&
							canBuyNow && (
								<button
									onClick={handleCtaClick}
									disabled={isProcessing}
									className="ml-3 cursor-pointer px-3 py-1.5"
									style={buttonPrimary.styles}
								>
									<div style={buttonPrimary.text.styles}>
										{isProcessing ? (
											<span className="loading loading-spinner loading-xs"></span>
										) : (
											ctaLabel
										)}
									</div>
								</button>
							)
						)}
					</div>
				</div>
			</div>

			<ProductDetailsModal />
		</>
	);
});
ResolvedFeaturedBundle.displayName = 'ResolvedFeaturedBundle';

interface TResolvedFeaturedBundleProps {
	node: TResolvedFeaturedProductNodeBundle;
	product: NonNullable<TResolvedSingleProductNodeContentMixin['value']['product']>;
	cx: TResolvedNodeProps<TResolvedFeaturedProductNodeBundle>['cx'];
}
