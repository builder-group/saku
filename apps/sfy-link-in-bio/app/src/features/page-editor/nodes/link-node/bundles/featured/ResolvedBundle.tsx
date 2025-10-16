import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedFeaturedLinkNodeBundle } from '../../types';

export const ResolvedFeaturedBundle = React.forwardRef<
	HTMLDivElement,
	TResolvedFeaturedBundleProps
>((props, ref) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, text, textSm, image }
	} = props;

	return (
		<div ref={ref}>
			<a
				href={content.url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex cursor-pointer flex-col items-center gap-2 hover:opacity-90"
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
							alt={content.title ?? 'Featured Image'}
							className="h-full w-full object-cover"
							draggable={false}
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-neutral-200" />
					)}
				</div>

				<div className="flex min-h-16 w-full min-w-0 flex-col justify-center gap-1 px-6">
					{content.title != null && (
						<p className="truncate font-medium" style={text.styles}>
							{content.title}
						</p>
					)}
					{content.description != null && (
						<p className="truncate opacity-70" style={textSm.styles}>
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
