import { TFeaturedProductNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { SingleProductNodeContentMixinEditor } from '../../../../mixins';
import { TProductNodeEditorContext } from '../../lib';

export const FeaturedBundleContentEditor: React.FC<TFeaturedBundleContentEditorProps> = (props) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return (
		<SingleProductNodeContentMixinEditor
			state={contentState}
			editor={cx.editor}
			className={className}
		/>
	);
};

interface TFeaturedBundleContentEditorProps {
	cx: TProductNodeEditorContext<TFeaturedProductNodeBundle>;
	className?: string;
}
