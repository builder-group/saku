import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedLinkNode, TResolvedYouTubeVideoEmbedLinkVariant } from '../../types';

export const YouTubeVideoEmbedContent: React.FC<TYouTubeVideoEmbedContentProps> = (props) => {
	const {
		node: { content, layout, appearance, typography, fill, stroke, shadow }
	} = props;

	return (
		<div
			className="relative block w-full overflow-hidden bg-white"
			style={{
				padding: layout?.padding,
				opacity: appearance.opacity,
				backgroundColor: fill?.paint.type === 'solid' ? fill?.paint.color : undefined,
				borderRadius: appearance?.borderRadius,
				boxShadow: shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
			}}
		>
			<div className="relative aspect-[16/9] w-full">
				<iframe
					src={`https://www.youtube.com/embed/${content.variant.videoId}`}
					className="absolute inset-0 h-full w-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			</div>
		</div>
	);
};

interface TYouTubeVideoEmbedContentProps {
	node: TResolvedLinkNode<TResolvedYouTubeVideoEmbedLinkVariant>;
	cx: TResolvedNodeProps<TResolvedLinkNode>['cx'];
}
