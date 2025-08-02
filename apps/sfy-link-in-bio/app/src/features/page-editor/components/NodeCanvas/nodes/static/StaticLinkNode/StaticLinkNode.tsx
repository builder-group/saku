import React from 'react';
import { TResolvedLinkNode } from '../../../../../types';
import { TStaticNodeProps } from '../../types';
import { DefaultContent } from './DefaultContent';
import { YouTubeVideoEmbedContent } from './YouTubeVideoEmbedContent';

export const StaticLinkNode = React.forwardRef<HTMLDivElement, TStaticNodeProps<TResolvedLinkNode>>(
	(props, ref) => {
		const {
			node: { content, style },
			cx,
			...divProps
		} = props;

		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				{(() => {
					switch (content.variant.type) {
						case 'default':
							return (
								<DefaultContent url={content.url} variant={content.variant} style={style} cx={cx} />
							);
						case 'youtube-video-embed':
							return <YouTubeVideoEmbedContent variant={content.variant} style={style} cx={cx} />;
						default:
							return null;
					}
				})()}
			</div>
		);
	}
);
StaticLinkNode.displayName = 'StaticLinkNode';
