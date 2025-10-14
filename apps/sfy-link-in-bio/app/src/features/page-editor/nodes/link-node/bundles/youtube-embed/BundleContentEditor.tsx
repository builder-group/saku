import { TYouTubeEmbedLinkNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { YouTubeEmbedLinkNodeContentMixinEditor } from '../../../../mixins';
import { TLinkNodeEditorContext } from '../../lib';

export const YoutubeEmbedBundleContentEditor: React.FC<TYoutubeEmbedBundleContentEditorProps> = (
	props
) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return (
		<YouTubeEmbedLinkNodeContentMixinEditor state={contentState} cx={cx} className={className} />
	);
};

interface TYoutubeEmbedBundleContentEditorProps {
	cx: TLinkNodeEditorContext<TYouTubeEmbedLinkNodeBundle>;
	className?: string;
}
