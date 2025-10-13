import { TClassicLinkNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { BasicLinkNodeContentMixinEditor } from '../../../../mixins';
import { TNodeEditorContext } from './lib';

export const ClassicContentEditor: React.FC<TClassicContentEditorProps> = (props) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return <BasicLinkNodeContentMixinEditor state={contentState} cx={cx} className={className} />;
};

interface TClassicContentEditorProps {
	cx: TNodeEditorContext<TClassicLinkNodeBundle>;
	className: string;
}
