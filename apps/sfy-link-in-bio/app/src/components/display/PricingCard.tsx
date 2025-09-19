import { Badge, Button, Text } from '@shopify/polaris';
import React from 'react';
import { PolarisXIcon } from '@/components';
import { cn } from '@/lib';
import { PolarisCheckIcon } from './icons';

export const PricingCard: React.FC<TPricingCardProps> = (props) => {
	const {
		title,
		description,
		price,
		features,
		featuredText,
		cta,
		frequency,
		className,
		...divProps
	} = props;

	return (
		<div className={cn('relative w-full md:max-w-80', className)} {...divProps}>
			{featuredText != null && (
				<div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 transform">
					<Badge size="large" tone="success">
						{featuredText}
					</Badge>
				</div>
			)}

			<div
				className={cn(
					'rounded-lg',
					featuredText != null && 'shadow-[0px_4px_20px_rgba(34,197,94,0.25)]'
				)}
			>
				<s-section>
					<div className="p-6">
						{/* Header */}
						<div className="space-y-2">
							<div>
								<Text as="h2" variant="headingLg">
									{title}
								</Text>
							</div>
							{description != null && (
								<div>
									<Text as="p" variant="bodySm" tone="subdued">
										{description}
									</Text>
								</div>
							)}
						</div>

						{/* Price */}
						<div className="mt-4 flex items-baseline gap-2">
							<Text as="h2" variant="heading2xl">
								{price}
							</Text>
							<Text as="span" variant="bodySm" tone="subdued">
								/ {frequency}
							</Text>
						</div>

						{/* CTA Button */}
						<div className="mt-4">
							<Button
								onClick={cta.onClick}
								variant={cta.variant}
								disabled={cta.disabled}
								loading={cta.loading}
								size="large"
								fullWidth
							>
								{cta.content}
							</Button>
						</div>

						{/* Features */}
						<div className="mt-4 space-y-2">
							<div>
								<Text as="h3" variant="headingMd">
									What's included:
								</Text>
							</div>
							<ul className="space-y-2">
								{features?.map((feature: TFeature, id: number) => (
									<li key={id} className="flex items-start gap-3">
										<span
											className={cn(
												'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
												feature.included ? 'bg-green-100' : 'bg-red-100'
											)}
										>
											{feature.included ? (
												<PolarisCheckIcon className="h-3 w-3 text-green-600" />
											) : (
												<PolarisXIcon className="h-3 w-3 text-red-600" />
											)}
										</span>
										<Text as="span" variant="bodyMd" tone="subdued">
											{feature.description}
										</Text>
									</li>
								))}
							</ul>
						</div>
					</div>
				</s-section>
			</div>
		</div>
	);
};

interface TPricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	price: string;
	features?: TFeature[];
	featuredText?: string;
	cta: {
		content: string;
		onClick?: () => void;
		variant?: 'primary' | 'secondary';
		disabled?: boolean;
		loading?: boolean;
	};
	frequency: string;
}

interface TFeature {
	description: string;
	included: boolean;
}
