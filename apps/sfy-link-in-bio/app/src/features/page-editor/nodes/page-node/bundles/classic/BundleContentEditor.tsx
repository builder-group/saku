import { TClassicFlatPageNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { BasicPageNodeContentMixinEditor } from '../../../../mixins';
import { TPageNodeEditorContext } from '../../lib';

export const ClassicBundleContentEditor: React.FC<TClassicBundleContentEditorProps> = (props) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return (
		<BasicPageNodeContentMixinEditor
			state={contentState}
			editor={cx.editor}
			className={className}
		/>
	);
};

interface TClassicBundleContentEditorProps {
	cx: TPageNodeEditorContext<TClassicFlatPageNodeBundle>;
	className?: string;
}
