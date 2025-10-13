import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedFeaturedLinkNodeBundle } from '../../types';

export const FeaturedContent: React.FC<TSingleContentProps> = (props) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, text, textSm, image }
	} = props;

	return (
		<a
			href={content.url}
			target="_blank"
			rel="noopener noreferrer"
			className="relative flex w-full cursor-pointer flex-col items-center gap-2 overflow-hidden bg-white hover:opacity-90"
			style={{
				...autoLayout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			{/* Thumbnail */}
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

			{/* Link Details */}
			<div className="flex w-full min-w-0 flex-col gap-1 px-2 pb-2">
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
	);
};

interface TSingleContentProps {
	node: TResolvedFeaturedLinkNodeBundle;
	cx: TResolvedNodeProps<TResolvedFeaturedLinkNodeBundle>['cx'];
}
