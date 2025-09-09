import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedLinkNode, TResolvedSpotifyEmbedLinkNodeContent } from '../../types';

export const SpotifyEmbedContent: React.FC<TSpotifyEmbedContentProps> = (props) => {
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
			<div className="relative h-auto w-full">
				<iframe
					src={content.embedUrl}
					className="absolute inset-0 h-full w-full"
					title="Spotify embed"
					width="100%"
					height={content.height}
					allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
					loading="lazy"
				></iframe>
			</div>
		</div>
	);
};

interface TSpotifyEmbedContentProps {
	node: TResolvedLinkNode<TResolvedSpotifyEmbedLinkNodeContent>;
	cx: TResolvedNodeProps<TResolvedLinkNode<TResolvedSpotifyEmbedLinkNodeContent>>['cx'];
}
