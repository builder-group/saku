import React from 'react';
import { TResolvedLinkNode, TResolvedYouTubeLinkVariant } from '../../../../../types';
import { TStaticNodeProps } from '../../types';

export const YouTubeContent: React.FC<TYouTubeContentProps> = (props) => {
	const { url, variant, style } = props;

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="relative flex w-full cursor-pointer items-center gap-3 overflow-hidden bg-white text-inherit no-underline hover:opacity-90"
			style={{
				padding: style.padding,
				backgroundColor: style.backgroundColor,
				fontFamily: style.font?.family,
				fontSize: style.fontSize,
				color: style.textColor,
				textAlign: style.textAlign,
				borderRadius: style.borderRadius,
				boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
			}}
		>
			YouTube Content
		</a>
	);
};

interface TYouTubeContentProps {
	url: string;
	variant: TResolvedYouTubeLinkVariant;
	style: TResolvedLinkNode['style'];
	cx: TStaticNodeProps<TResolvedLinkNode>['cx'];
}
