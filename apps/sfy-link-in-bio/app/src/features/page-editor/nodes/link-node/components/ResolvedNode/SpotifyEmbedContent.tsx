import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedLinkNode, TResolvedSpotifyEmbedLinkNodeContent } from '../../types';

export const SpotifyEmbedContent: React.FC<TSpotifyEmbedContentProps> = (props) => {
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
				className="h-full w-full rounded-none"
				title="Spotify embed"
				width="100%"
				height={content.height}
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				loading="lazy"
				style={{
					...image.styles,
					height: content.height,
					backgroundColor: content.theme?.backgroundBase
				}}
			></iframe>
		</div>
	);
};

interface TSpotifyEmbedContentProps {
	node: TResolvedLinkNode<TResolvedSpotifyEmbedLinkNodeContent>;
	cx: TResolvedNodeProps<TResolvedLinkNode<TResolvedSpotifyEmbedLinkNodeContent>>['cx'];
}
