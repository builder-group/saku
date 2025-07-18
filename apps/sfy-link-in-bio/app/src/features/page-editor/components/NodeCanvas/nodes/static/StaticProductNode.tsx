import React from 'react';
import { TResolvedProductNode } from '../../../../types';
import { TStaticNodeProps } from '../types';

export const StaticProductNode = React.forwardRef<
	HTMLDivElement,
	TStaticNodeProps<TResolvedProductNode>
>((props, ref) => {
	const {
		node: {
			content: { product },
			style
		},
		state,
		...divProps
	} = props;

	const imageUrl = React.useMemo(() => product?.images?.[0], [product?.images]);

	if (product == null) {
		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				<div
					className="relative flex w-full items-center gap-3 overflow-hidden bg-white"
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
					{/* Skeleton Product Image */}
					<div
						className="h-12 w-12 flex-shrink-0 animate-pulse overflow-hidden bg-gray-200"
						style={{ borderRadius: style.borderRadius }}
					/>

					{/* Skeleton Product Details and Price */}
					<div className="flex min-w-0 flex-grow items-center justify-between">
						<div className="flex min-w-0 flex-col justify-center gap-1">
							<div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
							<div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
						</div>
						<div className="ml-3 h-3 w-16 animate-pulse rounded bg-gray-200" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			<a
				href={product.checkoutUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="relative flex w-full items-center gap-3 overflow-hidden bg-white text-inherit no-underline hover:opacity-90"
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
						<img
							src={imageUrl}
							alt={product.title}
							className="h-full w-full object-cover"
							draggable={false}
						/>
					</div>
				)}

				{/* Product Details and Price */}
				<div className="flex min-w-0 flex-grow items-center justify-between">
					<div className="flex min-w-0 flex-col justify-center">
						<p className="truncate font-medium">{product.title}</p>
						{product.variant?.title && (
							<p className="text-base-content/50 mt-0.5 truncate text-xs">
								{product.variant.title}
							</p>
						)}
					</div>
					{product.variant?.price != null && (
						<p className="text-base-content/50 ml-3 min-w-fit text-right text-xs">
							{product.variant.price.currencyCode} {product.variant.price.amount}
						</p>
					)}
				</div>
			</a>
		</div>
	);
});
StaticProductNode.displayName = 'StaticProductNode';
