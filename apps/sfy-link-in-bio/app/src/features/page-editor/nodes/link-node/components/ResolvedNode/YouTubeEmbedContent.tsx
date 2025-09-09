import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedLinkNode, TResolvedYouTubeEmbedLinkNodeContent } from '../../types';

export const YouTubeEmbedContent: React.FC<TYouTubeEmbedContentProps> = (props) => {
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
					title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
				></iframe>
			</div>
		</div>
	);
};

interface TYouTubeEmbedContentProps {
	node: TResolvedLinkNode<TResolvedYouTubeEmbedLinkNodeContent>;
	cx: TResolvedNodeProps<TResolvedLinkNode<TResolvedYouTubeEmbedLinkNodeContent>>['cx'];
}
