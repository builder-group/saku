import React from 'react';
import { TLinkNode, TWithResolvedStyles } from '../../../../types';

export const StaticLinkNode = React.forwardRef<HTMLDivElement, TStaticLinkNodeProps>(
	(props, ref) => {
		const { node, ...divProps } = props;

		const title = node.meta?.title;
		const description = node.meta?.description;
		const faviconUrl = node.meta?.faviconUrl;

		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				<div
					className="relative overflow-hidden bg-white"
					style={{
						padding: node.style.padding,
						margin: node.style.margin,
						backgroundColor: node.style.backgroundColor,
						fontFamily: node.style.fontFamily,
						fontSize: node.style.fontSize,
						color: node.style.textColor,
						textAlign: node.style.textAlign,
						borderRadius: node.style.borderRadius,
						boxShadow: node.style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
					}}
				>
					<div className="flex w-full items-center gap-3 p-4">
						{/* Site Icon */}
						{faviconUrl && (
							<div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded bg-gray-100">
								<img
									src={faviconUrl}
									alt={title ?? 'Site Icon'}
									className="h-full w-full object-cover"
									draggable={false}
								/>
							</div>
						)}

						{/* Link Details */}
						<div className="min-w-0 flex-grow">
							{title && <p className="truncate font-medium">{title}</p>}
							{description && <p className="truncate text-sm opacity-70">{description}</p>}
						</div>
					</div>
				</div>
			</div>
		);
	}
);
StaticLinkNode.displayName = 'StaticLinkNode';

interface TStaticLinkNodeProps extends React.HTMLProps<HTMLDivElement> {
	node: TWithResolvedStyles<TLinkNode>;
}
