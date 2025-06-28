import React from 'react';
import { TLinkNode } from '../../../../types';

export const StaticLinkNode: React.FC<TStaticLinkNodeProps> = (props) => {
	const { node } = props;

	// Get title from custom meta or fallback to regular meta
	const getTitle = React.useCallback((): string | undefined => {
		return node.customMeta?.title ?? node.meta?.title;
	}, [node.customMeta, node.meta]);

	// Get favicon from custom meta or fallback to regular meta
	const getFaviconUrl = React.useCallback((): string | undefined => {
		return node.customMeta?.faviconUrl ?? node.meta?.faviconUrl;
	}, [node.customMeta, node.meta]);

	const title = getTitle();
	const faviconUrl = getFaviconUrl();

	return (
		<div className="w-full max-w-md">
			{/* Main container with Bento styling */}
			<div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
				{/* Cx1 Layout */}
				<div className="flex w-full items-center gap-2 p-5">
					{/* Site Icon */}
					<div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5] shadow-[0_1px_2px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.08]">
						{faviconUrl ? (
							<img
								src={faviconUrl}
								alt={title ?? 'Site Icon'}
								className="h-full w-full rounded object-cover"
								draggable={false}
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center text-sm text-[#999]">
								?
							</div>
						)}
					</div>

					{/* Link Details */}
					<div className="min-w-0 flex-grow">
						<p className="truncate text-base font-medium">{title ?? 'Loading...'}</p>
					</div>
				</div>

				{/* Border and highlight effects */}
				<div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/[0.08]" />
				<div className="pointer-events-none absolute inset-[1px] rounded-[23px] ring-1 ring-white/[0.22]" />
			</div>
		</div>
	);
};

interface TStaticLinkNodeProps {
	node: TLinkNode;
}
