import { TSectionTitleTextNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { BasicTextNodeContentMixinEditor } from '../../../../mixins';
import { TTextNodeEditorContext } from '../../lib';

export const SectionTitleBundleContentEditor: React.FC<TSectionTitleBundleContentEditorProps> = (
	props
) => {
	const { cx, className } = props;
	const contentState = useNodeProperty(cx.node, 'content');

	return (
		<BasicTextNodeContentMixinEditor
			state={contentState}
			editor={cx.editor}
			className={className}
		/>
	);
};

interface TSectionTitleBundleContentEditorProps {
	cx: TTextNodeEditorContext<TSectionTitleTextNodeBundle>;
	className?: string;
}
