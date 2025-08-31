import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedLinkNode, TResolvedYouTubeVideoEmbedLinkNodeContent } from '../../types';

export const YouTubeVideoEmbedContent: React.FC<TYouTubeVideoEmbedContentProps> = (props) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow }
	} = props;

	return (
		<div
			className="relative block w-full overflow-hidden bg-white"
			style={{
				...autoLayout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			<div className="relative aspect-[16/9] w-full">
				<iframe
					src={content.embedUrl}
					className="absolute inset-0 h-full w-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			</div>
		</div>
	);
};

interface TYouTubeVideoEmbedContentProps {
	node: TResolvedLinkNode<TResolvedYouTubeVideoEmbedLinkNodeContent>;
	cx: TResolvedNodeProps<TResolvedLinkNode<TResolvedYouTubeVideoEmbedLinkNodeContent>>['cx'];
}
