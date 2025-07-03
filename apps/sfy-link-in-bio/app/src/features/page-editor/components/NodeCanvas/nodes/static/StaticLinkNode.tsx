import React from 'react';
import { TResolvedLinkNode } from '../../../../types';

export const StaticLinkNode = React.forwardRef<HTMLDivElement, TStaticLinkNodeProps>(
	(props, ref) => {
		const { node, ...divProps } = props;

		const { title, description, faviconUrl } = React.useMemo(() => {
			return {
				title: node.meta?.title ?? node.fetchedMeta?.title,
				description: node.meta?.description ?? node.fetchedMeta?.description,
				faviconUrl: node.meta?.favicon ?? node.fetchedMeta?.favicon
			};
		}, [node]);

		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				<a
					href={node.url}
					target="_blank"
					rel="noopener noreferrer"
					className="relative flex w-full cursor-pointer items-center gap-3 overflow-hidden bg-white text-inherit no-underline hover:opacity-90"
					style={{
						padding: node.style.padding,
						backgroundColor: node.style.backgroundColor,
						fontFamily: node.style.font?.family,
						fontSize: node.style.fontSize,
						color: node.style.textColor,
						textAlign: node.style.textAlign,
						borderRadius: node.style.borderRadius,
						boxShadow: node.style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
					}}
				>
					<div className="flex min-h-12 w-full items-center gap-3">
						{/* Site Icon */}
						{faviconUrl != null && (
							<div
								className="h-12 w-12 flex-shrink-0 overflow-hidden bg-gray-100"
								style={{
									borderRadius: node.style.borderRadius
								}}
							>
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
							{title != null && <p className="truncate font-medium">{title}</p>}
							{description != null && <p className="truncate text-sm opacity-70">{description}</p>}
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
