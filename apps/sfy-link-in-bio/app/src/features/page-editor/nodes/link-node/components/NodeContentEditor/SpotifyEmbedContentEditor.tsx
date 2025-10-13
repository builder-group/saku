import { TSpotifyEmbedLinkNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { SpotifyEmbedLinkNodeContentMixinEditor } from '../../../../mixins';
import { TNodeEditorContext } from './lib';

export const SpotifyEmbedContentEditor: React.FC<TSpotifyEmbedContentEditorProps> = (props) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return (
		<SpotifyEmbedLinkNodeContentMixinEditor state={contentState} cx={cx} className={className} />
	);
};

interface TSpotifyEmbedContentEditorProps {
	cx: TNodeEditorContext<TSpotifyEmbedLinkNodeBundle>;
	className: string;
}
