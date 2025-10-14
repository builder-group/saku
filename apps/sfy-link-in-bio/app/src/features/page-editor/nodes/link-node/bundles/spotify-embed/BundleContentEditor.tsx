import { TSpotifyEmbedLinkNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { SpotifyEmbedLinkNodeContentMixinEditor } from '../../../../mixins';
import { TLinkNodeEditorContext } from '../../lib';

export const SpotifyEmbedBundleContentEditor: React.FC<TSpotifyEmbedBundleContentEditorProps> = (
	props
) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return (
		<SpotifyEmbedLinkNodeContentMixinEditor state={contentState} cx={cx} className={className} />
	);
};

interface TSpotifyEmbedBundleContentEditorProps {
	cx: TLinkNodeEditorContext<TSpotifyEmbedLinkNodeBundle>;
	className?: string;
}
