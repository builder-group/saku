import { TClassicAboutNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { BasicAboutNodeContentMixinEditor } from '../../../../mixins';
import { TNodeEditorContext } from '../../components/NodeContentEditor/lib';

export const ClassicBundleContentEditor: React.FC<TClassicBundleContentEditorProps> = (props) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return (
		<BasicAboutNodeContentMixinEditor
			state={contentState}
			editor={cx.editor}
			className={className}
		/>
	);
};

interface TClassicBundleContentEditorProps {
	cx: TNodeEditorContext<TClassicAboutNodeBundle>;
	className?: string;
}
