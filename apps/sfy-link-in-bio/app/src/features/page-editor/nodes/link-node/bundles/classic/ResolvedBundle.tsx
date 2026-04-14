import React from 'react';
import { cn } from '@/lib';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedClassicLinkNodeBundle } from '../../types';

export const ResolvedClassicBundle = React.forwardRef<HTMLDivElement, TResolvedClassicBundleProps>(
	(props, ref) => {
		const {
			cx,
			node: {
				id,
				type,
				content,
				autoLayout,
				appearance,
				fill,
				stroke,
				shadow,
				animation,
				textBody,
				textCaption,
				image
			}
		} = props;

		const handleClick = React.useCallback(() => {
			cx.integrations.tracking.trackEvent({
				name: 'outbound_link_click',
				properties: {
					site_id: cx.id,
					site_handle: cx.handle,
					page_url: typeof window !== 'undefined' ? window.location.href : cx.url.platform,
					node_id: id,
					node_type: type,
					destination_url: content.url
				}
			});
		}, [content.url, cx, id, type]);

		return (
			<div ref={ref}>
				<a
					href={content.url}
					target="_blank"
					rel="noopener noreferrer"
					onClick={handleClick}
					className="flex min-h-16 cursor-pointer flex-row items-center gap-2 hover:opacity-90"
					aria-label={content.title != null ? `Visit ${content.title}` : 'Visit external link'}
					style={{
						...autoLayout.styles,
						...appearance.styles,
						...fill?.styles,
						...stroke?.styles,
						...shadow?.styles,
						...animation?.styles
					}}
				>
					{content.thumbnail != null && (
						<div className="h-12 w-12 shrink-0 overflow-hidden bg-neutral-100" style={image.styles}>
							<img
								src={content.thumbnail.src}
								alt={content.title != null ? `${content.title} thumbnail` : 'Link thumbnail'}
								className="h-full w-full object-cover"
								draggable={false}
							/>
						</div>
					)}

					<div
						className={cn(
							'flex w-full min-w-0 flex-col gap-1',
							content.thumbnail == null && 'px-6'
						)}
					>
						{content.title != null && (
							<p
								className={cn(
									'font-medium',
									// Title only: 2 lines, Title + Description: 1 line
									content.description == null ? 'line-clamp-2 text-balance' : 'truncate'
								)}
								style={textBody.styles}
							>
								{content.title}
							</p>
						)}
						{content.description != null && (
							<p
								className={cn(
									'opacity-70',
									// Description only: 2 lines, Title + Description: 1 line
									content.title == null ? 'line-clamp-2 text-balance' : 'truncate'
								)}
								style={textCaption.styles}
							>
								{content.description}
							</p>
						)}
					</div>
				</a>
			</div>
		);
	}
);
ResolvedClassicBundle.displayName = 'ResolvedClassicBundle';

interface TResolvedClassicBundleProps {
	node: TResolvedClassicLinkNodeBundle;
	cx: TResolvedNodeProps<TResolvedClassicLinkNodeBundle>['cx'];
}
