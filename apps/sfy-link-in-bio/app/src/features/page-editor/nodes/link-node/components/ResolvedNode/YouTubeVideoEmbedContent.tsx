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
				...layout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			<div className="relative aspect-[16/9] w-full">
				<iframe
					src={content.variant.embedUrl}
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
