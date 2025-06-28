import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TFlattenedNode } from '../../../lib';
import { TTextNode } from '../../../types';
import { StaticTextNode } from './static';

export const TextNode: React.FC<TTextNodeProps> = (props) => {
	const { nodeState } = props;
	const node = useFeatureState(nodeState);

	return <StaticTextNode node={node} />;
};

interface TTextNodeProps {
	nodeState: TState<TFlattenedNode<TTextNode>, []>;
}
