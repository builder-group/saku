import { THeroAboutNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { BasicAboutNodeContentMixinEditor } from '../../../../mixins';
import { TAboutNodeEditorContext } from '../../lib';

export const HeroBundleContentEditor: React.FC<THeroBundleContentEditorProps> = (props) => {
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

interface THeroBundleContentEditorProps {
	cx: TAboutNodeEditorContext<THeroAboutNodeBundle>;
	className?: string;
}
