import { useFeatureState } from 'feature-react';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../lib';
import { TMediaNode } from '../../../types';
import { StaticMediaNode } from './static';

export const MediaNode = React.forwardRef<HTMLDivElement, TMediaNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;
	const node = useFeatureState(nodeState);

	return <StaticMediaNode {...divProps} ref={ref} node={node} editor={editor} />;
});
MediaNode.displayName = 'MediaNode';

interface TMediaNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TMediaNode>;
	editor: TPageEditor;
}
