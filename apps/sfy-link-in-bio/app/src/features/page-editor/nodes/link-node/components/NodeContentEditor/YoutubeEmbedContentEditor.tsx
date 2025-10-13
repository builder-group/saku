import { TYouTubeEmbedLinkNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { YouTubeEmbedLinkNodeContentMixinEditor } from '../../../../mixins';
import { TNodeEditorContext } from './lib';

export const YoutubeEmbedContentEditor: React.FC<TYoutubeEmbedContentEditorProps> = (props) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return (
		<YouTubeEmbedLinkNodeContentMixinEditor state={contentState} cx={cx} className={className} />
	);
};

interface TYoutubeEmbedContentEditorProps {
	cx: TNodeEditorContext<TYouTubeEmbedLinkNodeBundle>;
	className: string;
}
