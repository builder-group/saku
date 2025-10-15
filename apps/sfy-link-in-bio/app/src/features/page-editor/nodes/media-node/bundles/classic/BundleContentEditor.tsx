import { TClassicMediaNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { SingleMediaNodeContentMixinEditor } from '../../../../mixins';
import { TMediaNodeEditorContext } from '../../lib';

export const ClassicBundleContentEditor: React.FC<TClassicBundleContentEditorProps> = (props) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return (
		<SingleMediaNodeContentMixinEditor
			state={contentState}
			editor={cx.editor}
			className={className}
		/>
	);
};

interface TClassicBundleContentEditorProps {
	cx: TMediaNodeEditorContext<TClassicMediaNodeBundle>;
	className?: string;
}
