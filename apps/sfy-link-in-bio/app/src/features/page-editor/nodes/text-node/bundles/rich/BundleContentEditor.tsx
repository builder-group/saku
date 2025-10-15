import { TRichTextNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { RichTextNodeContentMixinEditor } from '../../../../mixins';
import { TTextNodeEditorContext } from '../../lib';

export const RichBundleContentEditor: React.FC<TRichBundleContentEditorProps> = (props) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return (
		<RichTextNodeContentMixinEditor state={contentState} editor={cx.editor} className={className} />
	);
};

interface TRichBundleContentEditorProps {
	cx: TTextNodeEditorContext<TRichTextNodeBundle>;
	className?: string;
}
