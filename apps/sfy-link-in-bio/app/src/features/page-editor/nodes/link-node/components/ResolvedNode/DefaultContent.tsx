import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedDefaultLinkVariant, TResolvedLinkNode } from '../../types';

export const DefaultContent: React.FC<TDefaultContentProps> = (props) => {
	const {
		node: { content, layout, appearance, typography, fill, stroke, shadow }
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
			href={content.url}
			target="_blank"
			rel="noopener noreferrer"
			className="relative flex w-full cursor-pointer items-center gap-3 overflow-hidden bg-white text-inherit no-underline hover:opacity-90"
			style={{
				padding: layout?.padding,
				opacity: appearance.opacity,
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
				{content.variant.favicon != null && (
					<div
						className="h-12 w-12 flex-shrink-0 overflow-hidden bg-gray-100"
						style={{
							borderRadius: iconBorderRadius
						}}
					>
						<img
							src={content.variant.favicon}
							alt={content.variant.title ?? 'Site Icon'}
							className="h-full w-full object-cover"
							draggable={false}
						/>
					</div>
				)}

				{/* Link Details */}
				<div className="min-w-0 flex-grow">
					{content.variant.title != null && (
						<p className="truncate font-medium">{content.variant.title}</p>
					)}
					{content.variant.description != null && (
						<p className="truncate text-sm opacity-70">{content.variant.description}</p>
					)}
				</div>
			</div>
		</a>
	);
};

interface TDefaultContentProps {
	node: TResolvedLinkNode<TResolvedDefaultLinkVariant>;
	cx: TResolvedNodeProps<TResolvedLinkNode>['cx'];
}
