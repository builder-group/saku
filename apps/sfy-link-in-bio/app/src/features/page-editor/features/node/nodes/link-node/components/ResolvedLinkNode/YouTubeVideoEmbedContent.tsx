import React from 'react';
import { TResolvedLinkNode, TResolvedYouTubeVideoEmbedLinkVariant } from '../../../../../../types';
import { TResolvedNodeProps } from '../../../../types';

export const YouTubeVideoEmbedContent: React.FC<TYouTubeVideoEmbedContentProps> = (props) => {
	const { variant, style } = props;

	return (
		<div
			className="relative block w-full overflow-hidden bg-white"
			style={{
				padding: style.padding,
				backgroundColor: style.backgroundColor,
				borderRadius: style.borderRadius,
				boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
			}}
		>
			<div className="relative aspect-[16/9] w-full">
				<iframe
					src={`https://www.youtube.com/embed/${variant.videoId}`}
					className="absolute inset-0 h-full w-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			</div>
		</div>
	);
};

interface TYouTubeVideoEmbedContentProps {
	variant: TResolvedYouTubeVideoEmbedLinkVariant;
	style: TResolvedLinkNode['style'];
	cx: TResolvedNodeProps<TResolvedLinkNode>['cx'];
}
