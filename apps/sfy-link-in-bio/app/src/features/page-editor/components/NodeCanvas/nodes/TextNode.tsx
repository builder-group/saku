import { useFeatureState } from 'feature-react';
import React from 'react';
import { TNodeState } from '../../../lib';
import { TTextNode } from '../../../types';
import { StaticTextNode } from './static';

export const TextNode = React.forwardRef<HTMLDivElement, TTextNodeProps>((props, ref) => {
	const { nodeState, ...divProps } = props;
	const node = useFeatureState(nodeState);

	return <StaticTextNode {...divProps} ref={ref} node={node} />;
});
TextNode.displayName = 'TextNode';

interface TTextNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TTextNode>;
}
