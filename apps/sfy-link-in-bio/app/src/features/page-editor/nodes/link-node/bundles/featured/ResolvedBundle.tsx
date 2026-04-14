import React from 'react';
import { cn } from '@/lib';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedFeaturedLinkNodeBundle } from '../../types';

export const ResolvedFeaturedBundle = React.forwardRef<
	HTMLDivElement,
	TResolvedFeaturedBundleProps
>((props, ref) => {
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
				className="flex cursor-pointer flex-col items-center gap-2 hover:opacity-90"
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
				<div className="aspect-video w-full overflow-hidden bg-neutral-200" style={image.styles}>
					{content.thumbnail != null ? (
						<img
							src={content.thumbnail.src}
							alt={content.title != null ? `${content.title} thumbnail` : 'Link thumbnail'}
							className="h-full w-full object-cover"
							draggable={false}
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-neutral-200" />
					)}
				</div>

				{(content.title != null || content.description != null) && (
					<div className="flex w-full min-w-0 flex-col justify-center gap-1 px-6">
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
				)}
			</a>
		</div>
	);
});
ResolvedFeaturedBundle.displayName = 'ResolvedFeaturedBundle';

interface TResolvedFeaturedBundleProps {
	node: TResolvedFeaturedLinkNodeBundle;
	cx: TResolvedNodeProps<TResolvedFeaturedLinkNodeBundle>['cx'];
}
