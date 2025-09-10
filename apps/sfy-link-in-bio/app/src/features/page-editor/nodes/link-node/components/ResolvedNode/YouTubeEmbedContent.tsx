import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedLinkNode, TResolvedYouTubeEmbedLinkNodeContent } from '../../types';

export const YouTubeEmbedContent: React.FC<TYouTubeEmbedContentProps> = (props) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, image }
	} = props;

	return (
		<div
			className="relative overflow-hidden"
			style={{
				...autoLayout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			<iframe
				src={content.embedUrl}
				className="aspect-[16/9] h-full w-full rounded-none"
				title="YouTube video player"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				allowFullScreen
				style={image.styles}
			></iframe>
		</div>
	);
};

interface TYouTubeEmbedContentProps {
	node: TResolvedLinkNode<TResolvedYouTubeEmbedLinkNodeContent>;
	cx: TResolvedNodeProps<TResolvedLinkNode<TResolvedYouTubeEmbedLinkNodeContent>>['cx'];
}
