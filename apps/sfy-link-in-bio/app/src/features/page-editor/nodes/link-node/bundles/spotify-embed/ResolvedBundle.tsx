import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedSpotifyEmbedLinkNodeBundle } from '../../types';

export const ResolvedSpotifyEmbedBundle = React.forwardRef<
	HTMLDivElement,
	TResolvedSpotifyEmbedBundleProps
>((props, ref) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, embed }
	} = props;
	const [isLoadingIframe, setIsLoadingIframe] = React.useState(true);

	return (
		<div
			ref={ref}
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
						...embed.styles,
						backgroundColor: content.theme?.backgroundBase || '#000000'
					}}
					aria-label="Loading Spotify content"
					role="status"
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
					...embed.styles,
					height: content.height,
					backgroundColor: content.theme?.backgroundBase
				}}
			></iframe>
		</div>
	);
});
ResolvedSpotifyEmbedBundle.displayName = 'ResolvedSpotifyEmbedBundle';

interface TResolvedSpotifyEmbedBundleProps {
	node: TResolvedSpotifyEmbedLinkNodeBundle;
	cx: TResolvedNodeProps<TResolvedSpotifyEmbedLinkNodeBundle>['cx'];
}
