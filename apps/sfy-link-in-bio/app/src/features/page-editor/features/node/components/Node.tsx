import { TFlatNode } from '@repo/editor';
import React from 'react';
import { useBoundingRectObserver } from '@/hooks';
import { nodeRegistry } from '../registry';
import { TNodeProps } from '../types';

export const Node: React.FC<TNodeProps<TFlatNode>> = (props) => {
	const { nodeState, editor } = props;

	useBoundingRectObserver(
		nodeState.ref,
		nodeState.boundingRect._v,
		(rect) => {
			nodeState.boundingRect.set(rect);
		},
		[nodeState]
	);

	const NodeComponent = React.useMemo(
		() => nodeRegistry[nodeState.type] as React.ComponentType<TNodeProps<TFlatNode>>,
		[nodeState.type]
	);
	if (NodeComponent == null) {
		return null;
	}

	return <NodeComponent ref={nodeState.ref} nodeState={nodeState} editor={editor} />;
};
