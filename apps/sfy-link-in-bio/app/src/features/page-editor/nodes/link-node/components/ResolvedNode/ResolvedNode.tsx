import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import {
	TResolvedLinkNode,
	TResolvedSingleLinkNodeContent,
	TResolvedYouTubeVideoEmbedLinkNodeContent
} from '../../types';
import { DefaultContent } from './SingleContent';
import { YouTubeVideoEmbedContent } from './YouTubeVideoEmbedContent';

export const ResolvedLinkNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedLinkNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;
	const { content } = node;

	const renderContent = React.useCallback(() => {
		switch (content.type) {
			case 'single':
				return (
					<DefaultContent
						node={node as TResolvedLinkNode<TResolvedSingleLinkNodeContent>}
						cx={cx}
					/>
				);
			case 'youtube-video-embed':
				return (
					<YouTubeVideoEmbedContent
						node={node as TResolvedLinkNode<TResolvedYouTubeVideoEmbedLinkNodeContent>}
						cx={cx}
					/>
				);
			default:
				return null;
		}
	}, [content.type, node, cx]);

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			{renderContent()}
		</div>
	);
});
ResolvedLinkNode.displayName = 'ResolvedLinkNode';
