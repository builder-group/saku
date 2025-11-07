import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedYouTubeEmbedLinkNodeBundle } from '../../types';

export const ResolvedYouTubeEmbedBundle = React.forwardRef<
	HTMLDivElement,
	TResolvedYouTubeEmbedBundleProps
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
						backgroundColor: '#000000'
					}}
					aria-label="Loading YouTube video"
					role="status"
				/>
			)}
			<iframe
				src={content.embedUrl}
				className="aspect-video h-full w-full rounded-none"
				title="YouTube video player"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				allowFullScreen
				onLoad={() => {
					setIsLoadingIframe(false);
				}}
				style={embed.styles}
			></iframe>
		</div>
	);
});
ResolvedYouTubeEmbedBundle.displayName = 'ResolvedYouTubeEmbedBundle';

interface TResolvedYouTubeEmbedBundleProps {
	node: TResolvedYouTubeEmbedLinkNodeBundle;
	cx: TResolvedNodeProps<TResolvedYouTubeEmbedLinkNodeBundle>['cx'];
}
