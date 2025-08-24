import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedDefaultLinkVariant, TResolvedLinkNode } from '../../types';

export const DefaultContent: React.FC<TDefaultContentProps> = (props) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, text }
	} = props;

	const iconBorderRadius = React.useMemo(() => {
		const verticalPadding = autoLayout?.verticalPadding ?? 0;
		const horizontalPadding = autoLayout?.horizontalPadding ?? 0;
		const padding = Math.max(verticalPadding, horizontalPadding);

		const outerRadius = appearance?.borderRadius;
		if (outerRadius == null || outerRadius === 0) {
			return undefined;
		}

		const ratio = outerRadius / (outerRadius + padding);
		return outerRadius * Math.pow(ratio, 1.5);
	}, [autoLayout?.verticalPadding, autoLayout?.horizontalPadding, appearance?.borderRadius]);

	return (
		<a
			href={content.url}
			target="_blank"
			rel="noopener noreferrer"
			className="relative flex w-full cursor-pointer items-center gap-3 overflow-hidden bg-white text-inherit no-underline hover:opacity-90"
			style={{
				...autoLayout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
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
							src={content.variant.favicon.src}
							alt={content.variant.title ?? 'Site Icon'}
							className="h-full w-full object-cover"
							draggable={false}
						/>
					</div>
				)}

				{/* Link Details */}
				<div className="min-w-0 flex-grow">
					{content.variant.title != null && (
						<p className="truncate font-medium" style={text.styles}>
							{content.variant.title}
						</p>
					)}
					{content.variant.description != null && (
						<p
							className="truncate opacity-70"
							style={{
								...text.styles,
								fontSize: text.typography.fontSize * 0.875
							}}
						>
							{content.variant.description}
						</p>
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
