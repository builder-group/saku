import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedDefaultLinkVariant, TResolvedLinkNode } from '../../types';

export const DefaultContent: React.FC<TDefaultContentProps> = (props) => {
	const {
		url,
		variant,
		node: { layout, appearance, typography, fill, stroke, shadow }
	} = props;

	const iconBorderRadius = React.useMemo(() => {
		const padding = layout?.padding ?? 0;
		const outerRadius = appearance?.borderRadius;
		if (outerRadius == null || outerRadius === 0) {
			return undefined;
		}
		const ratio = outerRadius / (outerRadius + padding);
		return outerRadius * Math.pow(ratio, 1.5);
	}, [layout?.padding, appearance?.borderRadius]);

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="relative flex w-full cursor-pointer items-center gap-3 overflow-hidden bg-white text-inherit no-underline hover:opacity-90"
			style={{
				padding: layout?.padding,
				backgroundColor: fill?.paint.type === 'solid' ? fill?.paint.color : undefined,
				fontFamily: typography?.font?.family,
				fontSize: typography?.fontSize,
				color: typography?.textColor,
				textAlign: typography?.textAlign,
				borderRadius: appearance?.borderRadius,
				boxShadow: shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
			}}
		>
			<div className="flex min-h-12 w-full items-center gap-3">
				{/* Site Icon */}
				{variant.favicon != null && (
					<div
						className="h-12 w-12 flex-shrink-0 overflow-hidden bg-gray-100"
						style={{
							borderRadius: iconBorderRadius
						}}
					>
						<img
							src={variant.favicon}
							alt={variant.title ?? 'Site Icon'}
							className="h-full w-full object-cover"
							draggable={false}
						/>
					</div>
				)}

				{/* Link Details */}
				<div className="min-w-0 flex-grow">
					{variant.title != null && <p className="truncate font-medium">{variant.title}</p>}
					{variant.description != null && (
						<p className="truncate text-sm opacity-70">{variant.description}</p>
					)}
				</div>
			</div>
		</a>
	);
};

interface TDefaultContentProps {
	url: string;
	variant: TResolvedDefaultLinkVariant;
	node: TResolvedLinkNode;
	cx: TResolvedNodeProps<TResolvedLinkNode>['cx'];
}
