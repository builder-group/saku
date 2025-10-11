import React, { useState } from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedYouTubeEmbedLinkNodeBundle } from '../../types';

export const YouTubeEmbedContent: React.FC<TYouTubeEmbedContentProps> = (props) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, image }
	} = props;
	const [isLoadingIframe, setIsLoadingIframe] = useState(true);

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
						backgroundColor: '#000000'
					}}
				/>
			)}
			<iframe
				src={content.embedUrl}
				className="aspect-[16/9] h-full w-full rounded-none"
				title="YouTube video player"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				allowFullScreen
				onLoad={() => {
					setIsLoadingIframe(false);
				}}
				style={image.styles}
			></iframe>
		</div>
	);
};

interface TYouTubeEmbedContentProps {
	node: TResolvedYouTubeEmbedLinkNodeBundle;
	cx: TResolvedNodeProps<TResolvedYouTubeEmbedLinkNodeBundle>['cx'];
}
