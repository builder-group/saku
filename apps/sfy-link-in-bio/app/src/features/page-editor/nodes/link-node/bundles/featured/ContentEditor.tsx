import { TFeaturedLinkNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { BasicLinkNodeContentMixinEditor } from '../../../../mixins';
import { TNodeEditorContext } from '../../components/NodeContentEditor/lib';

export const FeaturedBundleContentEditor: React.FC<TFeaturedBundleContentEditorProps> = (props) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return <BasicLinkNodeContentMixinEditor state={contentState} cx={cx} className={className} />;
};

interface TFeaturedBundleContentEditorProps {
	cx: TNodeEditorContext<TFeaturedLinkNodeBundle>;
	className?: string;
}
