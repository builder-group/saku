import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedSpotifyEmbedLinkNodeBundle } from '../../types';

export const SpotifyEmbedContent: React.FC<TSpotifyEmbedContentProps> = (props) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, image }
	} = props;
	const [isLoadingIframe, setIsLoadingIframe] = React.useState(true);

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
			{isLoadingIframe && (
				<div
					className="absolute inset-0 animate-pulse"
					style={{
						...image.styles,
						backgroundColor: content.theme?.backgroundBase || '#000000'
					}}
				/>
			)}
			<iframe
				src={content.embedUrl}
				className="h-full w-full rounded-none"
				title="Spotify embed"
				width="100%"
				height={content.height}
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				loading="lazy"
				onLoad={() => {
					setIsLoadingIframe(false);
				}}
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
	node: TResolvedSpotifyEmbedLinkNodeBundle;
	cx: TResolvedNodeProps<TResolvedSpotifyEmbedLinkNodeBundle>['cx'];
}
