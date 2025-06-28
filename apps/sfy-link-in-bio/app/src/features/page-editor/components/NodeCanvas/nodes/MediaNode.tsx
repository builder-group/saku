import { useFeatureState } from 'feature-react';
import React from 'react';
import { TNodeState } from '../../../lib';
import { TMediaNode } from '../../../types';
import { StaticMediaNode } from './static';

export const MediaNode = React.forwardRef<HTMLDivElement, TMediaNodeProps>((props, ref) => {
	const { nodeState, ...divProps } = props;
	const node = useFeatureState(nodeState);

	return <StaticMediaNode {...divProps} ref={ref} node={node} />;
});
MediaNode.displayName = 'MediaNode';

interface TMediaNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TMediaNode>;
}
