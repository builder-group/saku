import { useFeatureState } from 'feature-react';
import React from 'react';
import { TNodeState } from '../../../lib';
import { TLinkNode } from '../../../types';
import { StaticLinkNode } from './static';

export const LinkNode = React.forwardRef<HTMLDivElement, TLinkNodeProps>((props, ref) => {
	const { nodeState, ...divProps } = props;
	const node = useFeatureState(nodeState);

	return <StaticLinkNode {...divProps} ref={ref} node={node} />;
});
LinkNode.displayName = 'LinkNode';

interface TLinkNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TLinkNode>;
}
