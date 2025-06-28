import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TFlattenedNode } from '../../../lib';
import { TMediaNode } from '../../../types';
import { StaticMediaNode } from './static';

export const MediaNode: React.FC<TMediaNodeProps> = (props) => {
	const { nodeState } = props;
	const node = useFeatureState(nodeState);

	return <StaticMediaNode node={node} />;
};

interface TMediaNodeProps {
	nodeState: TState<TFlattenedNode<TMediaNode>, []>;
}
