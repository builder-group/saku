import { THeroAboutNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { BasicAboutNodeContentMixinEditor } from '../../../../mixins';
import { TNodeEditorContext } from './create-node-editor-context';

export const HeroContentEditor: React.FC<THeroContentEditorProps> = (props) => {
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

interface THeroContentEditorProps {
	cx: TNodeEditorContext<THeroAboutNodeBundle>;
	className?: string;
}
