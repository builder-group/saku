import { TClassicLinkNodeBundle } from '@repo/editor';
import React from 'react';
import { useNodeProperty } from '../../../../hooks';
import { BasicLinkNodeContentMixinEditor } from '../../../../mixins';
import { TNodeEditorContext } from '../../components/NodeContentEditor/lib';

export const ClassicBundleContentEditor: React.FC<TClassicBundleContentEditorProps> = (props) => {
	const { cx, className } = props;

	const contentState = useNodeProperty(cx.node, 'content');

	return <BasicLinkNodeContentMixinEditor state={contentState} cx={cx} className={className} />;
};

interface TClassicBundleContentEditorProps {
	cx: TNodeEditorContext<TClassicLinkNodeBundle>;
	className?: string;
}
