import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TFlattenedNode } from '../../../lib';
import { TLinkNode } from '../../../types';
import { StaticLinkNode } from './static';

export const LinkNode: React.FC<TLinkNodeProps> = (props) => {
	const { nodeState } = props;
	const node = useFeatureState(nodeState);

	return <StaticLinkNode node={node} />;
};

interface TLinkNodeProps {
	nodeState: TState<TFlattenedNode<TLinkNode>, []>;
}
