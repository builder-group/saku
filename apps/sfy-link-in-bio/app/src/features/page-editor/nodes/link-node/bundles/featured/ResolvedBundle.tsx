import React from 'react';
import { cn } from '@/lib';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedFeaturedLinkNodeBundle } from '../../types';

export const ResolvedFeaturedBundle = React.forwardRef<
	HTMLDivElement,
	TResolvedFeaturedBundleProps
>((props, ref) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, textBody, textCaption, image }
	} = props;

	return (
		<div ref={ref}>
			<a
				href={content.url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex cursor-pointer flex-col items-center gap-2 hover:opacity-90"
				aria-label={content.title != null ? `Visit ${content.title}` : 'Visit external link'}
				style={{
					...autoLayout.styles,
					...appearance.styles,
					...fill?.styles,
					...stroke?.styles,
					...shadow?.styles
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

				<div className="flex min-h-12 w-full min-w-0 flex-col justify-center gap-1 px-6">
					{content.title != null && (
						<p
							className={cn(
								'font-medium text-balance',
								// Title only: 2 lines, Title + Description: 1 line
								content.description == null ? 'line-clamp-2' : 'truncate'
							)}
							style={textBody.styles}
						>
							{content.title}
						</p>
					)}
					{content.description != null && (
						<p
							className={cn(
								'text-balance opacity-70',
								// Description only: 2 lines, Title + Description: 1 line
								content.title == null ? 'line-clamp-2' : 'truncate'
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
});
ResolvedFeaturedBundle.displayName = 'ResolvedFeaturedBundle';

interface TResolvedFeaturedBundleProps {
	node: TResolvedFeaturedLinkNodeBundle;
	cx: TResolvedNodeProps<TResolvedFeaturedLinkNodeBundle>['cx'];
}
