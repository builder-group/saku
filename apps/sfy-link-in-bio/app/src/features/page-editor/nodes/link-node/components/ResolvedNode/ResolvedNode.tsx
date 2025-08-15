import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import {
	TResolvedDefaultLinkVariant,
	TResolvedLinkNode,
	TResolvedYouTubeVideoEmbedLinkVariant
} from '../../types';
import { DefaultContent } from './DefaultContent';
import { YouTubeVideoEmbedContent } from './YouTubeVideoEmbedContent';

export const ResolvedLinkNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedLinkNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;
	const { content } = node;

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			{(() => {
				switch (content.variant.type) {
					case 'default':
						return (
							<DefaultContent
								node={node as TResolvedLinkNode<TResolvedDefaultLinkVariant>}
								cx={cx}
							/>
						);
					case 'youtube-video-embed':
						return (
							<YouTubeVideoEmbedContent
								node={node as TResolvedLinkNode<TResolvedYouTubeVideoEmbedLinkVariant>}
								cx={cx}
							/>
						);
					default:
						return null;
				}
			})()}
		</div>
	);
});
ResolvedLinkNode.displayName = 'ResolvedLinkNode';
