import React from 'react';
import { TResolvedLinkNode } from '../../../../types';

export const StaticLinkNode = React.forwardRef<HTMLDivElement, TStaticLinkNodeProps>(
	(props, ref) => {
		const {
			node: { content, style },
			...divProps
		} = props;

		const iconBorderRadius = React.useMemo(() => {
			const padding = style.padding ?? 0;
			const outerRadius = style.borderRadius;
			if (outerRadius == null || outerRadius === 0) {
				return undefined;
			}
			const ratio = outerRadius / (outerRadius + padding);
			return outerRadius * Math.pow(ratio, 1.5);
		}, [style.borderRadius, style.padding]);

		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				<a
					href={content.url}
					target="_blank"
					rel="noopener noreferrer"
					className="relative flex w-full cursor-pointer items-center gap-3 overflow-hidden bg-white text-inherit no-underline hover:opacity-90"
					style={{
						padding: style.padding,
						backgroundColor: style.backgroundColor,
						fontFamily: style.font?.family,
						fontSize: style.fontSize,
						color: style.textColor,
						textAlign: style.textAlign,
						borderRadius: style.borderRadius,
						boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
					}}
				>
					<div className="flex min-h-12 w-full items-center gap-3">
						{/* Site Icon */}
						{content.meta.favicon != null && (
							<div
								className="h-12 w-12 flex-shrink-0 overflow-hidden bg-gray-100"
								style={{
									borderRadius: iconBorderRadius
								}}
							>
								<img
									src={content.meta.favicon}
									alt={content.meta.title ?? 'Site Icon'}
									className="h-full w-full object-cover"
									draggable={false}
								/>
							</div>
						)}

						{/* Link Details */}
						<div className="min-w-0 flex-grow">
							{content.meta.title != null && (
								<p className="truncate font-medium">{content.meta.title}</p>
							)}
							{content.meta.description != null && (
								<p className="truncate text-sm opacity-70">{content.meta.description}</p>
							)}
						</div>
					</div>
				</a>
			</div>
		);
	}
);
StaticLinkNode.displayName = 'StaticLinkNode';

interface TStaticLinkNodeProps extends React.HTMLProps<HTMLDivElement> {
	node: TResolvedLinkNode;
}
