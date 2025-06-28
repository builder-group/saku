import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TFlattenedNode } from '../../../lib';
import type { TAboutNode } from '../../../types';
import { StaticAboutNode } from './static';

export const AboutNode: React.FC<TAboutNodeProps> = (props) => {
	const { nodeState } = props;
	const node = useFeatureState(nodeState);

	return <StaticAboutNode node={node} />;
};

interface TAboutNodeProps {
	nodeState: TState<TFlattenedNode<TAboutNode>, []>;
}
